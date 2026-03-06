const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage, dialog } = require('electron');
const path = require('path');

let win;

function createWindow() {
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: 275,
    height: 340,
    x: sw - 310,
    y: 40,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    skipTaskbar: false,
    hasShadow: false,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false
    }
  });

  win.loadFile('index.html');
  win.setAlwaysOnTop(true, 'screen-saver'); // highest level — floats over everything
  win.setVisibleOnAllWorkspaces(true);       // visible on all virtual desktops

  // Remove from taskbar on Windows
  win.setSkipTaskbar(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());

// IPC: window controls inside widget calls this
ipcMain.on('close-app', () => app.quit());
let tray = null;
ipcMain.on('minimize-app', (event, dataUrl) => {
  try {
    if (win) {
      if (win.isMinimized()) win.restore();
      else win.minimize();
    }
    if (!tray) {
      const fallbackUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAANSURBVBhXY3jP4PgfAAWgA4wXyMTEAAAAAElFTkSuQmCC';
      const iconUrl = (dataUrl && typeof dataUrl === 'string') ? dataUrl : fallbackUrl;
      const icon = nativeImage.createFromDataURL(iconUrl);
      tray = new Tray(icon);
      const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => { if (win) win.show(); } },
        {
          label: 'Quit', click: () => {
            tray.destroy();
            tray = null;
            app.quit();
          }
        }
      ]);
      tray.setToolTip('Pomogranate');
      tray.setContextMenu(contextMenu);
      tray.on('click', () => {
        if (win) win.show();
      });
    }
  } catch (err) {
    dialog.showErrorBox('Minimize Error', err.stack || err.message || String(err));
  }
});


