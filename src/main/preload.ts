// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */

/**
 // @boiler-plate-backup
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'save-sudoku';

const electronHandler = {
	ipcRenderer: {
		sendMessage(channel: Channels, ...args: unknown[]) {
			ipcRenderer.send(channel, ...args);
		},
		on(channel: Channels, func: (...args: unknown[]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
				func(...args);
			ipcRenderer.on(channel, subscription);

			return () => {
				ipcRenderer.removeListener(channel, subscription);
			};
		},
		once(channel: Channels, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		},
	},
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
**/

const { contextBridge, ipcRenderer, ipcMain } = require('electron');

import {LOAD_TOPIC, SAVE_TOPIC} from '../utils/Data'; 

// contextBridge.exposeInMainWorld('electronAPI', {
// 	setTitle: (title: string) => { ipcRenderer.send('set-title', title) }
// });

const electronHandler = {
	ipcRenderer: {
		getTitle(): Promise<string> {
			return ipcRenderer.invoke('getTitle');
		},

		// newTitle(func: (arg: string) => void) {
		// 	ipcRenderer.once(SAVE_TOPIC, (_event, arg) => func(arg));
		// },
	},
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;