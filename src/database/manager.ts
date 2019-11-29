import { getAuthStatus, getAllContacts } from 'node-mac-contacts';
import { Database, OPEN_READWRITE } from 'sqlite3';

import { normalizeNumber, cleanData } from './utils';

let contacts: ContactInfo[] = [];
let db: any;

/***** HELPER FUNCTIONS *****/

/**
 * Fetches the unique id(s) from the iMessage database corresponding
 * to a given phone number belonging to a Contact. Typically, a
 * phone number is associated  with only one id, but if you have
 * for example corresponded with them via SMS and iMessage, or
 * in a group chat, they can have multiple.
 * 
 * @param contact - the basic data for a given Contact
 * @param index - the unique index to associate with a Contact
 * @returns an array containing all unique id(s) for a Contact's phone number.
 */
async function getUniqueIDs (number: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const query = `SELECT ROWID from chat WHERE chat_identifier = '${number}'`;
    db.all(query, (err: string, data: any) => {
      if (err) {
        reject(err);
      } else {
        const mapped = data.map((handle: any) => handle.ROWID);
        resolve(mapped);
      }
    });
  });
};

/**
 * Maps each Contact to its associated iMessage information.
 * 
 * @param contact - the basic data for a given Contact
 * @param index - the unique index to associate with a Contact
 * @returns the updated Contact with iMessage data
 */
function mapContact (contact: ContactInfo, index: number) {
  const contactData: ContactInfo = {
    id: index.toString(),
    firstName: contact.firstName,
    lastName: contact.lastName,
    phoneNumbers: contact.phoneNumbers.map((n: string) => {
      return normalizeNumber(n)
    }),
    messages: {},
  };

  contactData.phoneNumbers.forEach(async (number: string) => {
    const ids = await getUniqueIDs(number);
    contactData.messages[number] = await getMessages(ids) as any;
  });

  return contactData;
};

/**
 * Returns all iMessages exchanged in conversation with a Contact
 * as specified by that Contact's unique id(s).
 * 
 * @param ids - an array of unique users ids.
 * @returns an Object with data about all messages exchanged with a 
 */
async function getMessages (ids: Array<string>) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT ROWID, text, service,
        CASE WHEN LENGTH(date) >= 18
          THEN (date / 1000000000)
        ELSE date END AS adjusted_date,
      date_read, is_from_me, cache_has_attachments, handle_id 
      FROM message AS messageT
      INNER JOIN chat_message_join AS chatMessageT 
        ON chatMessageT.chat_id IN (${ids.join(',')})
        AND messageT.ROWID = chatMessageT.message_id
      ORDER BY adjusted_date
    `;

    db.all(query, (err: string, data: RawData[]) => {
      if (err) {
        reject(err);
      } else {
        const cleaned = cleanData(data);
        resolve(cleaned);
      }
    });
  });
};

/***** EXPORTED FUNCTIONS *****/

/**
 * Returns the user's Contacts with mapped iMessage data.
 * 
 * @returns the array of all initialized Contacts
 */
export const getContacts = () => contacts;

/**
 * Fetch a single Contact by first or last name.
 * 
 * @param name - either the first or last name of a Contact
 * @returns the matching Contact
 */
export const getContact = (name: string) => {
  return contacts.filter((c: ContactInfo) => {
    return c.firstName === name || c.lastName === name;
  })
}

/**
 * Creates and opens a connection to the iMessage Database, and maps
 * data from the database into each contact from the user's macOS
 * contacts store.
 */
export async function initializeDatabase() {
  const messageDBPath = '/Users/codebytere/Library/Messages/chat.db';
  db = new Database(messageDBPath, OPEN_READWRITE, (err) => {
    if (err) console.error(err);
  });

  const status = getAuthStatus();
  if (status !== 'Authorized') {
    throw new Error('Access to contacts was not authorized.');
  } else {
    contacts = getAllContacts().map((c: ContactInfo, idx: number) => {
      return mapContact(c, idx);
    });
  }
};

/**
* Shuts down the connection to the iMessage database
*/
export function shutdownDatabase() {
  db.close((err: string) => {
    if (err) console.error(err);
  });
}
