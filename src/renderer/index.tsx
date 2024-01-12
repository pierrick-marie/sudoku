import { createRoot } from 'react-dom/client';
// import App from './App';

import TicTacToe from './TicTacToe';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
// root.render(<App />);
root.render(<TicTacToe />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
