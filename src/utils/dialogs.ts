import { dialog, shell } from 'electron'

/**
 * Runs a dialog informing the users that this app needs
 * access to Contacts in order to work properly.
 */
export async function runContactsFailureDialog() {
  const result = await dialog.showMessageBox({
    buttons: ['Open System Preferences', 'Cancel'],
    defaultId: 0,
    detail:
      'In order to use this application you need to give it access to Contacts. Open System Preferences?',
    message: 'Access to Contacts was not authorized.',
  })

  if (result.response === 0) {
    const fdaPath =
      'x-apple.systempreferences:com.apple.preference.security?Privacy_Contacts'
    await shell.openExternal(fdaPath)
  }
}

/**
 * Runs a dialog informing the users that this app needs
 * Full Disk Access in order to function properly, as without
 * it the app is unable to connect to the messaging database.
 */
export async function runFDAFailureDialog() {
  const result = await dialog.showMessageBox({
    buttons: ['Open System Preferences', 'Cancel'],
    defaultId: 0,
    detail:
      'In order to use this application you need to give it Full Disk Access, since the iMessage database requires it. Open System Preferences?',
    message: 'Access to iMessage Database was not authorized.',
  })

  if (result.response === 0) {
    const fdaPath =
      'x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles'
    await shell.openExternal(fdaPath)
  }
}
