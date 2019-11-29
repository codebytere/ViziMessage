import React from "react";
import './ContactList.css';

type ContactListProps = {
  contacts: ContactInfo[],
  changeContact: Function,
}

class ContactList extends React.Component<ContactListProps, {}> {
  constructor(props: ContactListProps) {
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
      <div className="contactList">
        {contacts.map((c: ContactInfo) => {
          return (
            <div className="contact">
              <button id={c.id.toString()} onClick={this.performChange}>
                {c.firstName} {c.lastName}
              </button>
            </div>
          )
        })}
      </div> 
    );
  }
}

export default ContactList;