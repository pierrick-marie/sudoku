import { createRoot } from 'react-dom/client';

import Root from './Sudoku';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(<Root />);


