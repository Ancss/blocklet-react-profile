import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css';
import './libs/i18n';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(<App />);
