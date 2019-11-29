import React from 'react';
import '../styles/ContactView.css';

class ContactView extends React.Component<{contact: ContactInfo | null}, {}> {
  render() {
    const { contact } = this.props;

    if (contact) {
      const { firstName, lastName, messages } = contact;
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