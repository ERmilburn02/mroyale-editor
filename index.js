const { Menu, app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require("electron-updater")

autoUpdater.checkForUpdatesAndNotify()

let win;
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  const template = [
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  win.setMenu(menu);

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Open the DevTools.
  win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const DiscordRPC = require('discord-rpc');
const clientId = '689401743221588042';
const rpc = new DiscordRPC.Client({transport: 'ipc'});
const startTimestamp = new Date();
let wName;
ipcMain.on('wNameUpdate', (event, arg) => {
  wName = arg;
  console.log(event);
  console.log(wName);
})
async function setActivity() {
  if (!rpc || !win) {
    return;
  };
  rpc.setActivity({
    details: `Editing ${wName}`,
    startTimestamp,
    instance: false,
  });
};
rpc.on('ready', () => {
  setActivity();
    // activity can only be set every 15 seconds
    setInterval(() => {
      setActivity();
    }, 15e3);
});
rpc.login({ clientId }).catch(console.error);