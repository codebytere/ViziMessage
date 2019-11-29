import { app, BrowserWindow, ipcMain } from 'electron';
import { homedir } from 'os';
import * as path from 'path';
import { getContacts, initializeDatabase, shutdownDatabase } from './data/manager';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

let win: Electron.BrowserWindow | null;

const createWindow = () => {
  win = new BrowserWindow({
    frame: false,
    resizable: false,
    width: 1200,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const ext = '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.2.0_0';
  const extPath = path.join(homedir(), ext);
  BrowserWindow.addDevToolsExtension(extPath);

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  ipcMain.handle('get-contact-data', async (event) => {
    return getContacts();
  });

  win.on('closed', () => { win = null; });
};

app.on('ready', () => {
  initializeDatabase();
  createWindow();
});

app.on('window-all-closed', () => {
  shutdownDatabase();
  if (process.platform !== 'darwin') { app.quit(); }
});

app.on('activate', () => {
  if (win === null) { createWindow(); }
});
