import React from 'react';
import '../styles/ContactView.css';
import { Tile, Section } from 'react-bulma-components';
import ScatterGraph from './ScatterGraph';

class ContactView extends React.Component<{contact: ContactInfo | null}, {}> {
  render() {
    const { contact } = this.props;

    if (contact) {
      const { firstName, lastName, messages } = contact;
      const first = Object.keys(messages)[0];
      const noData = messages[first].total === 0;
      return (
        <Section>
          <h2>{firstName} {lastName}</h2>
          { noData ? null :
            <Tile kind="ancestor">
              <Tile size={4} vertical={true} kind="parent">
                <Tile kind="child" className="box">
                  <p className="title">Text Stats</p>
                    <p>Total Texts: {messages[first].total}</p>
                    <p>From Me: {messages[first].fromMe.length}</p>
                    <p>From Them: {messages[first].fromThem.length}</p>
                </Tile>
                <Tile kind="child" className="box">
                  <p className="title">Two</p>
                  <p>TODO</p>
                </Tile>
              </Tile>
              <Tile kind="parent">
                <Tile kind="child" className="box">
                  <p className="title">Texts by Date</p>
                  <ScatterGraph data={messages[first]}></ScatterGraph>
                </Tile>
              </Tile>
            </Tile>
          }
        </Section>
      );
    }
  }
}

export default ContactView;