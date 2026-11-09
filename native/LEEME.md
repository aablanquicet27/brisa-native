# Brisa como app (Android y iPhone)

La app es un "cascarón": abre la misma Brisa de siempre (https://ip-172-31-29-16.tail02876e.ts.net).
Cuando Brisa se mejora en el servidor, la app se actualiza sola; solo hace falta instalar otra versión
si cambia algo del cascarón (ícono, permisos, teclado).

Necesitas estar conectado (wifi o datos). Sin conexión verás «Sin conexión — reintentando» y entra sola
cuando vuelva la red.

## Android

1. En el teléfono, abre este enlace (no hace falta iniciar sesión en GitHub):
   **https://github.com/aablanquicet27/brisa-native/releases/latest/download/Brisa.apk**
   (todas las versiones: github.com/aablanquicet27/brisa-native/releases).
2. Se descarga **Brisa.apk**.
3. Ábrelo desde la notificación de descarga. La primera vez Android pregunta si permites instalar apps
   de Chrome (o del navegador que uses): **Configuración → Permitir de esta fuente** → atrás → **Instalar**.
4. Abre **Brisa** desde el ícono y entra con tu correo y contraseña (la sesión queda guardada).
5. Para actualizar: descarga el APK nuevo y ábrelo; se instala encima sin perder la sesión
   (todas las versiones van firmadas con la misma llave).

Si Play Protect avisa «app desconocida», toca **Más detalles → Instalar de todas formas** (es tu propia app,
no está en la Play Store).

## iPhone (TestFlight)

Antes, una sola vez, en el computador:

1. Entra a **developer.apple.com/account** con tu Apple ID. Si aparece un aviso de acuerdo nuevo
   («Program License Agreement»), léelo y acéptalo. Sin eso Apple no deja firmar la app.
2. Entra a **appstoreconnect.apple.com → Apps → + → Nueva app**: plataforma iOS, nombre **Brisa**,
   idioma Español (México), ID de paquete **com.aablanquicet.brisa**, SKU **brisa001**, acceso completo.
   (Si el ID de paquete no aparece en la lista, primero corre el flujo «iOS (TestFlight)» en GitHub una vez:
   él lo registra.)
3. En GitHub → **brisa-native** → **Actions → iOS (TestFlight) → Run workflow**. Tarda ~20 min.

En el iPhone:

1. Instala **TestFlight** desde la App Store.
2. Ábrela con el mismo Apple ID de App Store Connect (aablanquicet@gmail.com). Como eres el titular de la
   cuenta, ya eres probador interno: en App Store Connect → Brisa → **TestFlight → Pruebas internas**,
   crea un grupo (ej. «Yo») y agrégate; te llega la invitación al correo.
3. En TestFlight toca **Instalar** en Brisa. Las versiones nuevas aparecen ahí mismo (**Actualizar**).

## Qué cambia frente a la versión del navegador

- iPhone: la app usa toda la pantalla, el campo queda justo encima del teclado y sin la barra ⌃⌄✓.
- Android: el botón o gesto «atrás» cierra la capa abierta; en la pantalla principal sale de la app.
- El micrófono pide permiso la primera vez que dictas.
- Los avisos (push) todavía no funcionan dentro de la app; siguen funcionando en Brisa desde el navegador.

## Para mantenimiento (técnico)

- Las compilaciones corren en el repo público **aablanquicet27/brisa-native** (solo `native/` y los workflows; Actions de los repos privados de la cuenta no arranca).
- `native/` es un proyecto Capacitor 8. `ios/` y `android/` NO se guardan: se generan en GitHub Actions
  (`npm run platform:android|ios`) y `scripts/patch-platforms.mjs` les pone permisos y versión.
- Íconos y arranque: `node native/scripts/assets.mjs` (genera `resources/`; en CI `@capacitor/assets` saca los tamaños).
- Android: `.github/workflows/android.yml` firma con la llave de los secretos `ANDROID_KEYSTORE_*`
  (copia de respaldo en el servidor, `~/.config/brisa-android/`). Si se pierde, los teléfonos tendrían que
  desinstalar y volver a instalar.
- iPhone: `.github/workflows/ios.yml` + `native/fastlane/Fastfile`. Certificados con fastlane match en el
  repo privado `aablanquicet27/brisa-certs` (cifrados con `MATCH_PASSWORD`; llave de despliegue `MATCH_DEPLOY_KEY`;
  respaldo en `~/.config/brisa-ios/`). Llave de App Store Connect: secretos `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8`.
