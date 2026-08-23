import { createRoot } from 'react-dom/client';
import App from '../../src/app/App';
import '../../src/styles/index.css';

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('React mount node #app was not found.');
}

createRoot(rootElement).render(<App />);
