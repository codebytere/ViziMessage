import { ipcRenderer } from 'electron';
import React from 'react';
import ContactList from "./components/ContactList";
import ContactView from "./components/ContactView";

import './styles/App.css';
import './styles/Loader.css';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Container, Columns } from 'react-bulma-components';

class App extends React.Component<{}, AppProps> {
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
      const filteredContacts: ContactInfo[] = contacts!.filter((c: ContactInfo) => {
        return c.id === selectedContact;
      });  

      if (filteredContacts.length > 0) { 
        selected = filteredContacts[0];
      }
    }
  
    return (
      <Container className="App">
        { loading ? 
          <div className="loading"></div>
          :
          <Columns>
          <Columns.Column size="one-quarter">
            <ContactList contacts={contacts!} changeContact={this.selectNewContact} />
          </Columns.Column>
          <Columns.Column>
            { selected ? <ContactView contact={selected} /> : null }
          </Columns.Column>
        </Columns>
        }
      </Container>
    );
  }
}

export default App;
