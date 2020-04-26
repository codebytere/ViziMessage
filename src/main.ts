import { app, BrowserWindow, ipcMain } from 'electron';
import { getContacts, getMessagesForIdentifier, initializeMessageData, shutdownDatabase } from './utils/database';
import { setupDevTools } from './utils/devtools';
import { isDevMode } from './utils/helpers';

// Webpack declares this, so we just need to tell TypeScript it'll be real
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

const createWindow = () => {
  const win = new BrowserWindow({
    frame: false,
    fullscreenable: false,
    height: 700,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
    width: 1200,
  });

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.on('ready', async () => {
  if (isDevMode()) {
    setupDevTools();
  }

  createWindow();
  await initializeMessageData();
});

app.on('window-all-closed', () => {
  shutdownDatabase();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});

ipcMain.handle('get-contact-data', async (event) => getContacts());

ipcMain.handle('get-message-data', async (event, identifier) => {
  const messageData = await getMessagesForIdentifier(identifier);
  return messageData;
});
