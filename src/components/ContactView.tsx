import React from 'react';
import { Tile, Section } from 'react-bulma-components';
import ScatterGraph from './ScatterGraph';
import { timeFormat, getDomain } from '../data/utils';

import '../styles/ContactView.css';

class ContactView extends React.Component<{contact: IContactInfo | null}, {}> {
  render() {
    const { contact } = this.props;

    if (contact) {
      const { firstName, lastName, messages } = contact;
      const first = messages[Object.keys(messages)[0]];

      const { total, fromMe, fromThem } = first;

      let start = 0;
      let end = 0;
      let mePercent = 0;
      let themPercent = 0;

      if (total !== 0) {
        [start, end] = getDomain(fromMe, fromThem);

        mePercent = Math.floor((fromMe.length/total) * 100);
        themPercent = Math.floor((fromThem.length/total) * 100);
      }

      return (
        <div>
          <h2 className='contact'>{firstName} {lastName}</h2>
          { total === 0 ? 
            <Section>NO DATA</Section> :
            <Section>
              <Tile kind='ancestor'>
                <Tile size={4} vertical={true} kind='parent'>
                  <Tile kind='child' className='basic-stats box' color='primary'>
                    <p className='title'>Basic Stats</p>
                      <p>
                        You and {firstName} have exchanged <strong>{total}</strong> total messages
                        since <strong>{timeFormat(start)}</strong>, with the most recent
                        on <strong>{timeFormat(end)}</strong>. You have sent
                        <strong> {fromMe.length} </strong> (<strong>{mePercent}%!</strong>) messages,
                        and you have recieved <strong>{fromThem.length} </strong>
                        (<strong>{themPercent}%!</strong>) messages.
                      </p>
                  </Tile>
                  <Tile kind='child' className='tbd box'>
                    <p className='title'>Two</p>
                    <p>TODO</p>
                  </Tile>
                </Tile>
                <Tile kind='parent'>
                  <Tile kind='child' className='texts-by-date box'>
                    <p className='title'>Texts by Date</p>
                    <ScatterGraph data={first}></ScatterGraph>
                  </Tile>
                </Tile>
              </Tile>
            </Section>
          }
        </div>
      );
    }
  }
}

export default ContactView;