# appshoelessjoe

Hello World Expo app with tunnel mode enabled.

## Prerequisites

- Node.js (v24.9.0 or compatible) ✅ Installed
- npm (v11.6.0 or compatible) ✅ Installed
- @expo/ngrok (v4.1.3) ✅ Installed (required for tunnel mode)
- Expo Go app on your iPhone (download from App Store)

## Setup & Run

All dependencies are already installed. Just run:

```bash
# Navigate to project directory
cd /Users/lukekensik/coding/appshoelessjoe

# Start Expo dev server with tunnel mode
npm start
```

Or use npx directly:

```bash
npx expo start --tunnel
```

## Connect on iPhone

1. Open the Expo Go app on your iPhone
2. Scan the QR code shown in your terminal
3. The app will load on your device via tunnel (works on different networks)

## Available Commands

- `npm start` - Start dev server with tunnel mode
- `npm run ios` - Start with iOS simulator (tunnel mode)
- `npm run android` - Start with Android emulator (tunnel mode)
- `npm run web` - Start web version

## Notes

- Tunnel mode allows connection even when iPhone and computer are on different networks
- The dev server will keep running until you stop it (Ctrl+C)
- Changes to code will hot-reload automatically
