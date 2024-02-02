/* eslint global-require: off, no-console: off, promise/always-return: off */



// Need to use IPC : https://www.electronjs.org/docs/latest/tutorial/ipc#ipc-channels



/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
// @boiler-plate-backup
// import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

import { Sudoku } from '../sudoku/deprecated/Data';

const OBJECT_NAME: string = 'MySudoku';

import {LOAD_TOPIC, SAVE_TOPIC} from '../sudoku/deprecated/Data'; 
import { electron } from 'process';
const FILE_PATH: string = '.config/sudoku.db';

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info';
		autoUpdater.logger = log;
		autoUpdater.checkForUpdatesAndNotify();
	}
}

let mainWindow: BrowserWindow | null = null;

interface MySudoku {
	name: string;
	data: Sudoku;
}

/**
 * Save Sudoku with NeDB
 */
/**
 // @boiler-plate-backup
ipcMain.on('save-sudoku', async (event, sudoku: SudokuData) => {
	// const msgTemplate = (sudoku: SudokuData) => `IPC test: ${sudoku.squares[0].value}`;

	DB.update({ name: OBJECT_NAME }, { $set: { data: sudoku } }, { upsert: true }, function (err: any, numReplaced: number, upsertId: any) {
		console.log(`Nb replaced: ${numReplaced}`);
	});

	DB.findOne({ name: OBJECT_NAME }, function (err: any, {name, data}: MySudoku) {
		// console.log(`Found: ${name}`);
		// console.log(data);
		console.log(data);
	});

	// DB.remove({ name: OBJECT_NAME }, {}, function (err: any, numRemoved: number) {
	// 	// numRemoved = 1
	// });

	event.reply('save-sudoku', 'response: saved');
});
**/

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

const isDebug =
	process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
	require('electron-debug')();
}

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS'];

	return installer
		.default(
			extensions.map((name) => installer[name]),
			forceDownload,
		)
		.catch(console.log);
};

const createWindow = async () => {
	if (isDebug) {
		await installExtensions();
	}

	const RESOURCES_PATH = app.isPackaged
		? path.join(process.resourcesPath, 'assets')
		: path.join(__dirname, '../../assets');

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths);
	};

	mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		icon: getAssetPath('icon.png'),
		autoHideMenuBar: true,
		webPreferences: {
			preload: app.isPackaged
				// Load packaged preload JS file
				? path.join(__dirname, 'preload.js')
				// load transpiled preload JS file
				: path.join(__dirname, '../../.erb/dll/preload.js'),  
		},
	});

	// const Datastore = require('nedb');
	// const DB = new Datastore({ filename: FILE_PATH, autoload: true });

	// ipcMain.on(SAVE_TOPIC, async (event, title: string) => {
	// 	console.log(title);

	// 	event.reply(SAVE_TOPIC, 'This is my new title');
	// });


	mainWindow.loadURL(resolveHtmlPath('index.html'));

	mainWindow.on('ready-to-show', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.show();
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	// @boiler-plate-backup
	// const menuBuilder = new MenuBuilder(mainWindow);
	// menuBuilder.buildMenu();

	// Open urls in the user's browser
	mainWindow.webContents.setWindowOpenHandler((edata) => {
		shell.openExternal(edata.url);
		return { action: 'deny' };
	});

	// Remove this if your app does not use auto updates
	// eslint-disable-next-line
	new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

async function handleGetTitle(): Promise<string> {

	console.log('Handle Get Title function');

	return 'Coucou from get title';
}

app
	.whenReady()
	.then(() => {
		createWindow();
		app.on('activate', () => {
			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (mainWindow === null) createWindow();
		});

		ipcMain.handle('getTitle', handleGetTitle)
		
	})
	.catch(console.log);
