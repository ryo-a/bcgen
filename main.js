const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
      app.quit();
    }
  });
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      titleBarStyle: 'hidden',
      'accept-first-mouse': true,
    });
    mainWindow.setMenu(null); 
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'ui/index.html'),
        protocol: 'file:',
        slashes: true
      }))
  
    // Open the DevTools.
    //mainWindow.openDevTools();
  
    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  });
  