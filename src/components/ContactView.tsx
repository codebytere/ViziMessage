import { ipcRenderer } from 'electron'
import React from 'react'
import { Box, Section, Tile } from 'react-bulma-components'
import { getDomain, timeFormat } from '../utils/graph'
import ScatterGraph from './ScatterGraph'

import '../styles/ContactView.css'

class ContactView extends React.Component<
  { contact: IContactInfo },
  IContactViewState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      data: ({} as any) as IContactMessageData,
      loading: true,
    }
  }

  public componentDidMount() {
    const { phoneNumbers, emailAddresses } = this.props.contact
    const id = phoneNumbers.length > 0 ? phoneNumbers[0] : emailAddresses[0]
    this.fetchContactData(id)
  }

  public componentDidUpdate(prevProps: any) {
    if (prevProps.contact !== this.props.contact) {
      this.setState({ loading: true })
      const { phoneNumbers, emailAddresses } = this.props.contact
      const id = phoneNumbers.length > 0 ? phoneNumbers[0] : emailAddresses[0]
      this.fetchContactData(id)
    }
  }

  public render() {
    const { firstName, lastName } = this.props.contact
    const data = this.state.data

    if (this.state.loading) {
      return <div className="loading" />
    } else {
      return (
        <div>
          <h2 className="contact">
            {firstName} {lastName}
          </h2>
          {data.total === 0
            ? this.renderNoData()
            : this.renderData(firstName, data)}
        </div>
      )
    }
  }

  /* PRIVATE INSTANCE METHODS */

  private async fetchContactData(identifier: string) {
    const data: IContactMessageData = await ipcRenderer.invoke(
      'get-message-data',
      identifier,
    )
    this.setState({ loading: false, data })
  }

  private renderNoData() {
    return (
      <Section>
        <Box className="no-data">
          <p>NO DATA</p>
        </Box>
      </Section>
    )
  }

  private renderData(firstName: string, data: IContactMessageData) {
    const { total, fromMe, fromThem } = data

    const [start, end] = getDomain(fromMe, fromThem)
    const mePercent = Math.round((fromMe.length / total) * 100)
    const themPercent = Math.round((fromThem.length / total) * 100)

    return (
      <Section>
        <Tile kind="ancestor">
          <Tile size={4} vertical={true} kind="parent">
            <Tile kind="child" className="basic-stats box" color="primary">
              <p className="title">Basic Stats</p>
              <p>
                You and {firstName} have exchanged <strong>{total}</strong>{' '}
                total messages since <strong>{timeFormat(start)}</strong>, with
                the most recent on <strong>{timeFormat(end)}</strong>.
              </p>
            </Tile>
            <Tile kind="child" className="percentages box">
              <p className="title">Percentages</p>
              <p>
                You have sent
                <strong> {fromMe.length} </strong> (
                <strong>{mePercent}%!</strong>) messages, and you have recieved{' '}
                <strong>{fromThem.length} </strong>(
                <strong>{themPercent}%!</strong>) messages.
              </p>
            </Tile>
          </Tile>
          <Tile kind="parent">
            <Tile kind="child" className="texts-by-date box">
              <p className="title">Texts by Date</p>
              <ScatterGraph data={data} />
            </Tile>
          </Tile>
        </Tile>
      </Section>
    )
  }
}

export default ContactView
