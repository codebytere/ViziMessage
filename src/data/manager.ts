import { app, dialog, shell } from "electron";
import { getAllContacts, getAuthStatus } from "node-mac-contacts";
import { homedir } from "os";
import { Database, OPEN_READWRITE } from "sqlite3";

import { cleanData, normalizeNumber } from "./utils";

let contacts: IContactInfo[] = [];
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
 * @returns an array containing all unique id(s) for a Contact"s phone number.
 */
async function getUniqueIDs(phoneNumber: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const query = `SELECT ROWID from chat WHERE chat_identifier = "${phoneNumber}"`;
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
 * Maps each Contact to its associated iMessage information.
 *
 * @param contact - the basic data for a given Contact
 * @param index - the unique index to associate with a Contact
 * @returns the updated Contact with iMessage data
 */
function mapContact(contact: IContactInfo, index: number) {
  const contactData: IContactInfo = {
    firstName: contact.firstName,
    id: index.toString(),
    lastName: contact.lastName,
    messages: {},
    phoneNumbers: contact.phoneNumbers.map((n: string) => {
      return normalizeNumber(n);
    }),
  };

  contactData.phoneNumbers.forEach(async (phoneNumber: string) => {
    const ids = await getUniqueIDs(phoneNumber);
    contactData.messages[phoneNumber] = await getMessages(ids);
  });

  return contactData;
}

/**
 * Returns all iMessages exchanged in conversation with a Contact
 * as specified by that Contact"s unique id(s).
 *
 * @param ids - an array of unique users ids
 * @returns an Object with data about all messages exchanged with a Contact
 */
async function getMessages(ids: string[]) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT ROWID, text, service,
        CASE WHEN LENGTH(date) >= 18
          THEN (date / 1000000000)
        ELSE date END AS adjusted_date,
      date_read, is_from_me, cache_has_attachments, handle_id
      FROM message AS messageT
      INNER JOIN chat_message_join AS chatMessageT
        ON chatMessageT.chat_id IN (${ids.join(",")})
        AND messageT.ROWID = chatMessageT.message_id
      ORDER BY adjusted_date
    `;

    db.all(query, (err: string, data: IRawData[]) => {
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
 * Opens up the connection to the iMessage database. If a
 * connection cannot be established, an error dialog is shown
 * and the app quits.
 */
function openDatabaseConnection() {
  // TODO(codebytere): allow users to specify custom db path.
  const messageDBPath = `${homedir()}/Library/Messages/chat.db`;
  db = new Database(messageDBPath, OPEN_READWRITE, (err) => {
    if (err) {
      dialog.showErrorBox(
        "Could not connect to database",
        `Unable to open database at: ${messageDBPath}`,
      );
      app.quit();
    }
  });
}

/***** EXPORTED FUNCTIONS *****/

/**
 * Returns the user"s Contacts with mapped iMessage data.
 *
 * @returns the array of all initialized Contacts
 */
export const getContacts = () => contacts;

/**
 * Creates and opens a connection to the iMessage Database, and maps
 * data from the database into each contact from the user"s macOS
 * contacts store.
 */
export async function initializeMessageData() {
  const status = getAuthStatus();
  if (status !== "Authorized") {
    dialog.showMessageBox({
      buttons: ["Open System Preferences", "Cancel"],
      defaultId: 0,
      detail: "In order to use this application you need to give it Full Disk Access, since the iMessage database requires it. Open System Preferences?",
      message: "Access to iMessage Database was not authorized.",
    }).then(async (res) => {
      if (res.response === 1) {
        await shell.openExternal("x-apple.systempreferences:com.apple.preference.security");
      }

      // Quit the app regardless of user choice.
      app.quit();
    });
  } else {
    openDatabaseConnection();
    contacts = getAllContacts().map((c: IContactInfo, idx: number) => {
      return mapContact(c, idx);
    });
  }
}

/**
 * Shuts down the connection to the iMessage database
 */
export function shutdownDatabase() {
  db.close((err: string) => {
    if (err) {
      console.log(err);
    }
  });
}
