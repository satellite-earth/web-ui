import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'earth.satellite',
	appName: 'Satellite',
	webDir: 'dist',
	backgroundColor: '171819',
	android: {
		allowMixedContent: true,
		// flavor: 'fdroid',
		buildOptions: {
			keystorePath: '../../android-keys.jks',
			keystoreAliasPassword: 'earth.satellite',
			keystorePassword: 'earth.satellite',
			keystoreAlias: 'key0',
		},
	},
	plugins: {
		CapacitorHttp: {
			enabled: true,
		},
	},
};

export default config;
