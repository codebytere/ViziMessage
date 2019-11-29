import { ipcRenderer } from 'electron';
import React from 'react';
import { Columns } from 'react-bulma-components';

import ContactList from "./components/ContactList";
import ContactView from "./components/ContactView";

import 'react-bulma-components/dist/react-bulma-components.min.css';
import './styles/App.css';
import './styles/Loader.css';

class App extends React.Component<{}, IAppProps> {
  constructor(props: any) {
    super(props);
    this.state = { loading: true };
    this.selectNewContact = this.selectNewContact.bind(this);
  }

  componentDidMount() {
    ipcRenderer.invoke('get-contact-data').then((contacts: IContactInfo[]) => {
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
      const filteredContacts: IContactInfo[] = contacts!.filter((c: IContactInfo) => {
        return c.id === selectedContact;
      });  

      if (filteredContacts.length > 0) { 
        selected = filteredContacts[0];
      }
    }
  
    return (
      <div className='App'>
        { loading ? 
          <div className='loading'></div> :
          <Columns>
          <Columns.Column className='contactList' size='one-fifth'>
            <ContactList contacts={contacts!} changeContact={this.selectNewContact} />
          </Columns.Column>
          <Columns.Column className='contactView' size='four-fifths'>
            { selected ? <ContactView contact={selected} /> : null }
          </Columns.Column>
        </Columns>
        }
      </div>
    );
  }
}

export default App;
