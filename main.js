const electron		= require('electron');
const app			= electron.app;
const BrowserWindow	= electron.BrowserWindow;

let developing = true;
let mainWindow = null;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1440, 
		height: 900,
		minWidth: 1440,
		minHeight: 900,
		darkTheme: true,
	});
	mainWindow.loadURL(`file://${__dirname}/index.html`);

	if ( developing ) {
		mainWindow.webContents.openDevTools();
	}

	mainWindow.on('closed', function() { mainWindow = null; });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
	if ( process.platform !== 'darwin' ) {
		app.quit();
	}
});

app.on('activate', function() {
	if ( mainWindow == null ) {
		createWindow();
	}
});