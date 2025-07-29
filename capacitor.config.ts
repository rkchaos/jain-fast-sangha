import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f0b60ec9eade480aa80b389f8ada8e30',
  appName: 'jain-fast-sangha',
  webDir: 'dist',
  server: {
    url: "https://f0b60ec9-eade-480a-a80b-389f8ada8e30.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#f8f7f5",
      showSpinner: false
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#f8f7f5"
    }
  }
};

export default config;