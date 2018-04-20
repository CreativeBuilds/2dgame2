const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const io_client = require('socket.io-client');

let win;

/* Make this file connect to the server and not index.html */

/*
 * 1. User connects to the server
 *  - If error, show that the server is down for maitence
 *  - If no error continue
 * 2. Show login screen (for now we'll just log in with google)
 * 3. Send the users information from the server to this client
 * 4. Load the game with the new client information
 */
let socket;
let timer;
  
function createWindow (fileName) {
    // Create the browser window.

    win = new BrowserWindow({width: 800, height: 600});
    

    //win.maximize();

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, `html/${fileName}.html`),
        protocol: 'file:',
        slashes: true
    }))
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
    })
}

app.on('ready', function(){
  socket = io_client('http://localhost:3000');

  socket.on('connect', function(){
    
   

    createWindow('index');
    if(timer){
      clearTimeout(timer);
    }
  })

  socket.on('connect_error', function(){
    if(!timer){
      timer = setTimeout(function(){
        console.log('Failed to connect to the server');
        createWindow('error');
      },15000)
    }
  })
})
  
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
    if (win === null) {
      createWindow('index')
    }
  })
  