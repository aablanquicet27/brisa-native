// Brisa nativa: un cascarón que carga la web en vivo (se actualiza sola); el cascarón casi nunca cambia.
import type { CapacitorConfig } from '@capacitor/cli';

const HOST = 'ip-172-31-29-16.tail02876e.ts.net';

const config: CapacitorConfig = {
  appId: 'com.aablanquicet.brisa',
  appName: 'Brisa',
  // Página propia sin conexión (va dentro de la app)
  webDir: 'www',
  backgroundColor: '#1b2140',
  // La web reconoce la app por esto (además de window.Capacitor)
  appendUserAgent: 'BrisaApp/1',
  server: {
    url: `https://${HOST}`,
    cleartext: false,
    allowNavigation: [HOST],
    errorPath: 'index.html',
  },
  ios: {
    contentInset: 'never',
    scrollEnabled: false,
    limitsNavigationsToAppBoundDomains: false,
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    // iOS: el webview se achica con el teclado (la píldora queda justo encima) y sin la barra ⌃⌄✓
    Keyboard: { resize: 'native', style: 'DARK', resizeOnFullScreen: true },
    StatusBar: { overlaysWebView: true, style: 'DARK', backgroundColor: '#1b2140' },
    SystemBars: { insetsHandling: 'css', style: 'DARK', initialViewportFitValueHint: 'cover' },
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      launchFadeOutDuration: 250,
      backgroundColor: '#1b2140',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: false,
      splashImmersive: false,
    },
  },
};

export default config;
