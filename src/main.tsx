import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import Desktop from './views/desktop';
import './native';

// if the app is running as a PWA run the service worker
if (CAP_IS_WEB) {
	import('./services/worker');
}

// setup dayjs
import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTimePlugin);
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { StrictMode } from 'react';
import { CAP_IS_WEB } from './env';
dayjs.extend(localizedFormat);

const shouldRenderDesktopUI = () => {
	// TODO always return false if desktop env
	// is not explicitly indicated by something
	// like window.satellite
	return window.location.hash.startsWith('#desktop:');
};

ReactDOM.createRoot(document.getElementById('root')!).render(shouldRenderDesktopUI() ? <Desktop /> : <App />);
