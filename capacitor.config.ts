import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.isaac.zenith',
  appName: 'Zenith',
  webDir: 'www',
  plugins: {
    App: {
      appUrlOpen: {
        schemes: ['zenith']
      }
    }
  },
};

export default config;
