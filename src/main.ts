import { app, BrowserWindow, ipcMain } from 'electron';
import { initializeDatabase, shutdownDatabase, getContacts } from './database/manager';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

let win: Electron.BrowserWindow | null;

const createWindow = () => {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });

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
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (win === null) createWindow();
});
