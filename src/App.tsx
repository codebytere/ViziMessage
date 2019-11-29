import { ipcRenderer } from 'electron';
import React from 'react';
import ContactList from "./components/ContactList";
import ContactView from "./components/ContactView";

import './App.css';

class App extends React.Component<{}, {
  loading: boolean,
  contacts?: any,
  selectedContact?: string
}> {
  constructor(props: any) {
    super(props);
    this.state = { loading: true };
    this.selectNewContact = this.selectNewContact.bind(this);
  }

  componentDidMount() {
    ipcRenderer.invoke('get-contact-data').then((contacts: ContactInfo[]) => {
      this.setState({
        loading: false,
        contacts,
        selectedContact: contacts[0].id
      });
    })
  }

  selectNewContact(id: string) {
    if (id) {
      this.setState({
        ...this.state,
        selectedContact: id
      });
    }
  }

  render() {
    const { loading, contacts, selectedContact } = this.state;

    let selected = null;
    if (selectedContact !== undefined) { 
      const filteredContacts: ContactInfo[] = contacts.filter((c: ContactInfo) => {
        return c.id === selectedContact;
      });  

      if (filteredContacts.length > 0) { 
        selected = filteredContacts[0];
      }
    }
  
    return (
      <div className="App">
        { loading ? 'Loading' : <ContactList contacts={contacts} changeContact={this.selectNewContact} />}
        { selected ? <ContactView contact={selected} /> : null }
      </div>
    );
  }
}

export default App;
