
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.556b4ed4c084420da6d96732c8c8efa2',
  appName: 'Ghibli Maker',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    url: 'https://556b4ed4-c084-420d-a6d9-6732c8c8efa2.lovableproject.com?forceHideBadge=true',
  },
  android: {
    backgroundColor: "#F6FBFD",
    contentInset: "scrollable",
  },
  ios: {
    contentInset: "scrollable",
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
