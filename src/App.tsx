import { ipcRenderer } from 'electron';
import React from 'react';
import ContactList from "./components/ContactList";
import './App.css';

class App extends React.Component<{}, {
  loading: boolean,
  data?: any 
}> {
  constructor(props: any) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    ipcRenderer.invoke('get-contact-data').then((contacts) => {
      this.setState({ loading: false, data: contacts });
    })
  }

  render() {
    const { loading, data } = this.state;
    return (
      <div className="App">
        { loading ? 'Loading' : <ContactList contacts={data} /> }
      </div>
    );
  }
}

export default App;
