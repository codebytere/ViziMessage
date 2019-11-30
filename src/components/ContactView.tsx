import React from 'react';
import { Box, Tile, Section } from 'react-bulma-components';
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

        mePercent = Math.round((fromMe.length/total) * 100);
        themPercent = Math.round((fromThem.length/total) * 100);
      }

      return (
        <div>
          <h2 className='contact'>{firstName} {lastName}</h2>
          { total === 0 ? 
            <Section>
              <Box className="no-data">
                <p>NO DATA</p>
              </Box>
            </Section> :
            <Section>
              <Tile kind='ancestor'>
                <Tile size={4} vertical={true} kind='parent'>
                  <Tile kind='child' className='basic-stats box' color='primary'>
                    <p className='title'>Basic Stats</p>
                      <p>
                        You and {firstName} have exchanged <strong>{total}</strong> total messages
                        since <strong>{timeFormat(start)}</strong>, with the most recent
                        on <strong>{timeFormat(end)}</strong>.
                      </p>
                  </Tile>
                  <Tile kind='child' className='percentages box'>
                    <p className='title'>Percentages</p>
                    <p>
                      You have sent
                      <strong> {fromMe.length} </strong> (<strong>{mePercent}%!</strong>) messages,
                      and you have recieved <strong>{fromThem.length} </strong>
                      (<strong>{themPercent}%!</strong>) messages.
                    </p>
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