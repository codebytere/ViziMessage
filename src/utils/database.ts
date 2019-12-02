import { app } from 'electron';
import { getAllContacts, getAuthStatus } from 'node-mac-contacts';
import { homedir } from 'os';
import { Database, OPEN_READWRITE } from 'sqlite3';
import { runContactsFailureDialog, runFDAFailureDialog } from './dialogs';
import { cleanData, normalizeNumber } from './helpers';

let contacts: IContactInfo[] = [];
let db: Database;

/***** HELPER FUNCTIONS *****/

/**
 * Fetches the unique id(s) from the message database corresponding
 * to a given phone number belonging to a Contact. Typically, a
 * phone number is associated  with only one id, but if you have
 * for example corresponded with them via SMS and iMessage, or
 * in a group chat, they can have multiple.
 *
 * @param contact - the basic data for a given Contact.
 * @param index - the unique index to associate with a Contact.
 * @returns an array containing all unique id(s) for a Contact's phone number.
 */
async function getUniqueIDs(phoneNumber: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const query = `SELECT ROWID from chat WHERE chat_identifier = '${phoneNumber}'`;
    db.all(query, (err: string, data: any) => {
      if (err) {
        reject(err);
      } else {
        const mapped = data.map((handle: any) => handle.ROWID);
        resolve(mapped);
      }
    });
  });
}

/**
 * Maps each Contact to its associated message information.
 *
 * @param contact - the basic data for a given Contact.
 * @param index - the unique index to associate with a Contact.
 * @returns the updated Contact with message data.
 */
function mapContact(contact: IContactInfo, index: number) {
  const contactData: IContactInfo = {
    emailAddresses: contact.emailAddresses,
    firstName: contact.firstName,
    id: index.toString(),
    lastName: contact.lastName,
    messages: {},
    phoneNumbers: contact.phoneNumbers.map((n: string) => {
      return normalizeNumber(n);
    }),
  };

  if (contactData.phoneNumbers.length > 0) {
    contactData.phoneNumbers.forEach(async (phoneNumber: string) => {
      const ids = await getUniqueIDs(phoneNumber);
      contactData.messages[phoneNumber] = await getMessages(ids);
    });
  }

  if (contactData.emailAddresses.length > 0) {
    contactData.emailAddresses.forEach(async (emailAddress: string) => {
      const ids = await getUniqueIDs(emailAddress);
      contactData.messages[emailAddress] = await getMessages(ids);
    });
  }

  return contactData;
}

/**
 * Returns all messages exchanged in conversation with a Contact
 * as specified by that Contact's unique id(s).
 *
 * @param ids - an array of unique users ids.
 * @returns an Object with data about all messages exchanged with a Contact.
 */
async function getMessages(ids: string[]): Promise<IContactMessageData> {
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

    db.all(query, (err, data: IRawData[]) => {
      if (err) {
        reject(err);
      } else {
        const cleaned = cleanData(data);
        resolve(cleaned);
      }
    });
  });
}

/**
 * Opens up the connection to the message database. If a
 * connection cannot be established, an error dialog is shown
 * and the app quits.
 */
async function openDatabaseConnection() {
  // TODO(codebytere): allow users to specify custom db path.
  const messageDBPath = `${homedir()}/Library/Messages/chat.db`;
  db = new Database(messageDBPath, OPEN_READWRITE, async (err) => {
    if (err) {
      await runFDAFailureDialog();
      app.quit();
    }
  });
}

/***** EXPORTED FUNCTIONS *****/

/**
 * Returns the user's Contacts with mapped message data.
 *
 * @returns the array of all initialized Contacts.
 */
export const getContacts = () => contacts;

/**
 * Creates and opens a connection to the message Database, and maps
 * data from the database into each contact from the user's macOS
 * contacts store.
 */
export async function initializeMessageData() {
  const status = getAuthStatus();
  if (status === 'Denied') {
    await runContactsFailureDialog();
    app.quit();
  } else {
    await openDatabaseConnection();
    contacts = getAllContacts().map((c: IContactInfo, idx: number) => {
      return mapContact(c, idx);
    });
  }
}

/**
 * Shuts down the connection to the message database
 */
export function shutdownDatabase() {
  // We don't really care if the database can be
  // closed successfully or not, since this will
  // only ever be called when we're already quitting.
  db.close();
}
