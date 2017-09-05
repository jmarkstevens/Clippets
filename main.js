'use strict';

const {app, BrowserWindow, ipcMain} = require('electron');
let fs = require('fs');
let config = require('./config.json');

let configRoot;
switch (process.platform) {
  case 'darwin':
    configRoot = process.env.HOME + config.darwin.dataRoot;
    break;
  case 'linux':
    configRoot = config.linux.dataRoot;
    break;
  case 'win32':
    configRoot = process.env.USERPROFILE + config.win32.dataRoot;
    break;
}

let rootDataPath = configRoot;

require('./js/mainipc.js')(ipcMain);

let mainWindow = null;
let mainWindowOptions = {
  icon: './ui-dist/img/Clippets1.ico',
  title: 'Clippets'
};

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow(mainWindowOptions);

  let windowStatePath = rootDataPath + 'windowstate.json';
  let windowState = {};
  if (false) mainWindow.openDevTools();
  let jsonReadCallBack = function(err, data) {
    if (err) console.log('error opening windowstate');
    else {
      windowState = JSON.parse(data.toString());
      mainWindow.setSize(windowState.size[0], windowState.size[1]);
      mainWindow.setPosition(windowState.position[0], windowState.position[1]);
    }
  };
  fs.readFile(windowStatePath, jsonReadCallBack);

  mainWindow.loadURL('file://' + __dirname + '/ui-dist/index.html');
  mainWindow.on('close', function() {
    windowState.size = mainWindow.getSize();
    windowState.position = mainWindow.getPosition();
    let writeFileCallBack = function(err) {
      if (err) console.log('error saving windowstate.json file ');
      mainWindow = null;
    };
    fs.writeFile(windowStatePath, JSON.stringify(windowState, null, 2), writeFileCallBack);
  });
});
