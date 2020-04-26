import { ipcRenderer } from 'electron'
import React from 'react'
import { Columns } from 'react-bulma-components'

import ContactList from './ContactList'
import ContactView from './ContactView'

// tslint:disable-next-line:no-submodule-imports
import 'react-bulma-components/dist/react-bulma-components.min.css'
import '../styles/App.css'
import '../styles/Loader.css'

class App extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props)
    this.state = { loading: true, contacts: [] }
    this.selectNewContact = this.selectNewContact.bind(this)
  }

  public async componentDidMount() {
    const contacts: IContactInfo[] = await ipcRenderer.invoke(
      'get-contact-data',
    )
    this.setState({
      contacts,
      loading: false,
      selectedContact: contacts[0].id,
    })
  }

  public render() {
    const { loading, contacts, selectedContact } = this.state

    let selected = null
    if (selectedContact !== undefined) {
      const filteredContacts = contacts.filter((c: IContactInfo) => {
        return c.id === selectedContact
      })

      if (filteredContacts.length > 0) {
        selected = filteredContacts[0]
      }
    }

    return (
      <div className="App">
        {loading ? this.renderLoading() : this.renderApp(contacts, selected)}
      </div>
    )
  }

  /* PRIVATE INSTANCE METHODS */

  private selectNewContact(id: string) {
    if (id) {
      this.setState({
        ...this.state,
        selectedContact: id,
      })
    }
  }

  private renderLoading() {
    return <div className="loading" />
  }

  private renderApp(contacts: IContactInfo[], selected: IContactInfo | null) {
    return (
      <Columns>
        <Columns.Column className="contactList" size="one-fifth">
          <ContactList
            contacts={contacts!}
            changeContact={this.selectNewContact}
          />
        </Columns.Column>
        <Columns.Column className="contactView" size="four-fifths">
          {selected ? <ContactView contact={selected} /> : null}
        </Columns.Column>
      </Columns>
    )
  }
}

export default App
