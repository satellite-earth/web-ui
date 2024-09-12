import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'earth.satellite',
	appName: 'Satellite',
	webDir: 'dist',
	backgroundColor: '171819',
	android: {
		allowMixedContent: true,
	},
	ios: {
		contentInset: 'always',
	},
	server: {
		cleartext: true,
	},
	plugins: {
		CapacitorHttp: {
			enabled: true,
		},
	},
};

export default config;
