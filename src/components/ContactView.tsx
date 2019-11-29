import React from 'react';
import './ContactView.css';

class ContactView extends React.Component<{contact: ContactInfo | null}, {}> {
  render() {
    if (this.props.contact) {
      const { firstName, lastName, messages } = this.props.contact;
      const first = Object.keys(messages)[0];
      return (
        <div>
          <span>{firstName} {lastName}</span>
          <span> TOTAL MESSAGES IS: {messages[first].total}</span>
        </div>
      );
    }
  }
}

export default ContactView;