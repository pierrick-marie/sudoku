/**
 // @boiler-plate-backup
import { ElectronHandler } from '../main/preload';

declare global {
	// eslint-disable-next-line no-unused-vars
	interface Window {
		electron: ElectronHandler;
	}
}

export { };
**/

// export interface IElectronAPI {
// 	setTitle: (title: string) => Promise<void>,
// }

// declare global {
// 	interface Window {
// 		electronAPI: IElectronAPI
// 	}
// }

import { ElectronHandler } from '../main/preload';

declare global {
	// eslint-disable-next-line no-unused-vars
	interface Window {
		electron: ElectronHandler;
	}
}

export { };