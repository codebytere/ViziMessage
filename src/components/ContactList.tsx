import React from "react";
import '../styles/ContactList.css';

import { Panel } from 'react-bulma-components';

class ContactList extends React.Component<IContactListProps, {}> {
  constructor(props: IContactListProps) {
    super(props);
    this.performChange = this.performChange.bind(this);
  }

  performChange(e: any) {
    if (e.target) {
      const id = e.target.id;
      this.props.changeContact(id);
    }
  }

  render() {
    const { contacts } = this.props;
    return (
      <Panel color='info'>
        <Panel.Header>Contacts</Panel.Header>
          {contacts.map((c: IContactInfo) => {
            return (
              <Panel.Block className="contactLink">
                <a id={c.id.toString()} onClick={this.performChange}>
                  {c.firstName} {c.lastName}
                </a>
              </Panel.Block>
            )
          })}
      </Panel> 
    );
  }
}

export default ContactList;