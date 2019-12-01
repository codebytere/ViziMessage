import { app, BrowserWindow, ipcMain } from 'electron';
import { getContacts, initializeMessageData, shutdownDatabase } from './utils/database';
import { setupDevTools } from './utils/devtools';
import { isDevMode } from './utils/helpers';

// Webpack declares this, so we just need to tell TypeScript it'll be real
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

let win: Electron.BrowserWindow | null;

const createWindow = () => {
  win = new BrowserWindow({
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

  ipcMain.handle('get-contact-data', async (event) => {
    return getContacts();
  });

  win.on('closed', () => { win = null; });
};

app.on('ready', () => {
  if (isDevMode()) {
    setupDevTools();
  }

  initializeMessageData();
  createWindow();
});

app.on('window-all-closed', () => {
  shutdownDatabase();
  if (process.platform !== 'darwin') { app.quit(); }
});

app.on('activate', () => {
  if (win === null) { createWindow(); }
});
