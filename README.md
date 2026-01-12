# appshoelessjoe

Expo app with camera OCR for barcode scanning and text detection from shoebox labels.

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

## Features

- **Barcode Scanning**: Real-time barcode scanning (EAN-13, EAN-8, Code 128, Code 39, UPC-A, UPC-E, QR codes)
- **Text Recognition (OCR)**: Capture images and detect text from shoebox labels
- **Dual Mode**: Switch between barcode scanning and OCR text detection modes
- **Tunnel Mode**: Connect your iPhone even when on different networks

## Usage

1. **Barcode Mode**: 
   - Point camera at any barcode
   - Scanned barcodes appear in the results section below
   - Tap "Scan Again" to scan another barcode

2. **OCR Text Mode**:
   - Switch to "OCR Text" mode
   - Tap "Capture & Scan Text" button
   - Point camera at text (shoebox labels, etc.)
   - Captured image will be processed for text recognition
   - Detected text will appear in results

## Dependencies

- `expo-camera` - Camera access
- `expo-barcode-scanner` - Barcode scanning
- `expo-image-picker` - Image capture
- `expo-image-manipulator` - Image processing
- `@react-native-ml-kit/text-recognition` - Text recognition (may require custom dev build)

## Notes

- Tunnel mode allows connection even when iPhone and computer are on different networks
- The dev server will keep running until you stop it (Ctrl+C)
- Changes to code will hot-reload automatically
- **Note**: Text recognition using ML Kit may require a custom development build for full functionality in Expo. Barcode scanning works in Expo Go.
