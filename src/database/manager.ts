import { getAuthStatus, getAllContacts } from 'node-mac-contacts';
import { Database, OPEN_READWRITE } from 'sqlite3';

import { normalizeNumber, cleanData } from './utils';

let contacts: any = [];
let db: any;

export const getContacts = () => contacts;

export const getContact = (name: string) => {
  return contacts.filter((c: any) => {
    return c.firstName === name || c.lastName === name;
  })
}

export async function initializeDatabase() {
  const messageDBPath = '/Users/codebytere/Library/Messages/chat.db';
  db = new Database(messageDBPath, OPEN_READWRITE, (err) => {
    if (err) console.error(err);
  });

  const status = getAuthStatus();
  if (status !== 'Authorized') {
    throw new Error('Access to contacts was not authorized.');
  } else {
    contacts = getAllContacts().map((c: any, idx: number) => mapContact(c, idx));
  }
};

export function shutdownDatabase() {
  db.close((err: string) => {
    if (err) console.error(err);
  });
}

async function getUniqueIDs (number: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const query = `SELECT ROWID from chat WHERE chat_identifier = ${number}`;
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

const mapContact = (contact: any, index: number) => {
  const contactData: Contact = {
    id: index,
    firstName: contact.firstName,
    lastName: contact.lastName,
    numbers: contact.phoneNumbers.map((n: string) => normalizeNumber(n)),
    messages: {},
  };

  contactData.numbers.forEach(async (number: string) => {
    const ids = await getUniqueIDs(number);
    contactData.messages[number] = await getMessages(ids) as any;
  });

  return contactData;
};

const getMessages = (ids: Array<string>) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT ROWID, guid, text, service,
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

    db.all(query, (err: string, data: any) => {
      if (err) {
        reject(err);
      } else {
        const cleaned = cleanData(data);
        resolve(cleaned);
      }
    });
  });
};
