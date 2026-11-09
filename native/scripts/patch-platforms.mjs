// Ajustes de las plataformas generadas en CI (`npx cap add ios|android`). Idempotente.
// Uso: node scripts/patch-platforms.mjs ios|android   (BUILD_NUMBER opcional: número de compilación)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const which = process.argv[2];
const build = Number(process.env.BUILD_NUMBER || 1);
const die = (m) => { console.error('patch-platforms: ' + m); process.exit(1); };
const edit = (file, fn) => {
  if (!existsSync(file)) die('no existe ' + file);
  const before = readFileSync(file, 'utf8');
  const after = fn(before);
  writeFileSync(file, after);
  console.log((before === after ? 'sin cambios ' : 'ajustado ') + file);
};

if (which === 'ios') {
  const KEYS = {
    NSMicrophoneUsageDescription: 'Brisa usa el micrófono para dictar mensajes',
    NSCameraUsageDescription: 'Brisa usa la cámara para tomar fotos y adjuntarlas a tus mensajes',
    NSPhotoLibraryUsageDescription: 'Brisa usa tus fotos solo para adjuntar las que elijas a tus mensajes',
    ITSAppUsesNonExemptEncryption: false,
    CFBundleDisplayName: 'Brisa',
  };
  edit('ios/App/App/Info.plist', (s) => {
    for (const [k, v] of Object.entries(KEYS)) {
      const val = typeof v === 'boolean' ? (v ? '<true/>' : '<false/>') : `<string>${v}</string>`;
      const re = new RegExp(`<key>${k}</key>\\s*(<string>[^<]*</string>|<true/>|<false/>)`);
      s = re.test(s) ? s.replace(re, `<key>${k}</key>\n\t${val}`) : s.replace(/<\/dict>\s*<\/plist>\s*$/, `\t<key>${k}</key>\n\t${val}\n</dict>\n</plist>\n`);
    }
    // Solo vertical en iPhone (el chat no está pensado en horizontal)
    s = s.replace(/(<key>UISupportedInterfaceOrientations<\/key>\s*<array>)[\s\S]*?(<\/array>)/,
      '$1\n\t\t<string>UIInterfaceOrientationPortrait</string>\n\t$2');
    return s;
  });
} else if (which === 'android') {
  edit('android/app/src/main/AndroidManifest.xml', (s) => {
    for (const p of ['android.permission.INTERNET', 'android.permission.RECORD_AUDIO', 'android.permission.MODIFY_AUDIO_SETTINGS']) {
      if (!s.includes(`"${p}"`)) s = s.replace(/<\/manifest>\s*$/, `    <uses-permission android:name="${p}" />\n</manifest>\n`);
    }
    // Solo vertical en el teléfono; el teclado achica la vista
    s = s.replace(/<activity\b(?![^>]*screenOrientation)/, '<activity\n            android:screenOrientation="portrait"');
    if (!/windowSoftInputMode/.test(s)) s = s.replace(/<activity\b/, '<activity\n            android:windowSoftInputMode="adjustResize"');
    return s;
  });
  edit('android/app/build.gradle', (s) => s
    .replace(/versionCode\s+\d+/, `versionCode ${build}`)
    .replace(/versionName\s+"[^"]*"/, `versionName "1.0.${build}"`));
} else die('uso: patch-platforms.mjs ios|android');
