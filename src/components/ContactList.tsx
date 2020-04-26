import React, { FormEvent } from 'react'
import '../styles/ContactList.css'

import { Panel } from 'react-bulma-components'

class ContactList extends React.Component<
  IContactListProps,
  { contacts: IContactInfo[] }
> {
  constructor(props: IContactListProps) {
    super(props)
    this.performChange = this.performChange.bind(this)
    this.filterContacts = this.filterContacts.bind(this)
    this.state = { contacts: this.props.contacts }
  }

  public render() {
    return (
      <Panel color="info">
        <Panel.Header>Contacts</Panel.Header>
        <Panel.Block className="contact-search">
          <input
            type="text"
            className="input is-medium"
            placeholder="Search"
            onChange={this.filterContacts}
          />
        </Panel.Block>
        {this.state.contacts.map((c: IContactInfo) => this.renderContact(c))}
      </Panel>
    )
  }

  public componentDidMount() {
    this.setState({ contacts: this.props.contacts })
  }

  /* PRIVATE INSTANCE METHODS */

  private filterContacts(e: FormEvent<HTMLInputElement>) {
    let updated = []

    if (e.currentTarget.value !== '') {
      updated = this.props.contacts.filter(c => {
        const name = `${c.firstName.toLowerCase()} ${c.lastName.toLowerCase()}`
        const target = e.currentTarget.value.toLowerCase()
        return name.includes(target)
      })
    } else {
      updated = this.props.contacts
    }

    this.setState({ contacts: updated })
  }

  private renderContact(c: IContactInfo) {
    return (
      <Panel.Block className="contactLink">
        <a id={c.id.toString()} onClick={this.performChange}>
          {c.firstName} {c.lastName}
        </a>
      </Panel.Block>
    )
  }

  private performChange(e: any) {
    if (e.target) {
      const id = e.target.id
      this.props.changeContact(id)
    }
  }
}

export default ContactList
