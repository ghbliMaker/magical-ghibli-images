import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.magicalghibli.app',
  appName: 'Ghibli Maker',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    url: 'https://556b4ed4-c084-420d-a6d9-6732c8c8efa2.lovableproject.com?forceHideBadge=true',
  },
  android: {
    backgroundColor: "#F6FBFD",
  },
  ios: {
    limitsNavigationsToAppBoundDomains: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: "#F6FBFD",
      showSpinner: false,
      spinnerColor: "#4EB5DA",
    }
  }
};

export default config;
