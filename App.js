import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import TextRecognition from '@react-native-ml-kit/text-recognition';

export default function App() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [barcodePermission, setBarcodePermission] = useState(null);
  const [mode, setMode] = useState('barcode'); // 'barcode' or 'ocr'
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState([]);
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setBarcodePermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      const newBarcode = { type, data, timestamp: new Date().toLocaleTimeString() };
      setBarcodeData(prev => [newBarcode, ...prev.slice(0, 9)]); // Keep last 10
      Alert.alert('Barcode Scanned!', `Type: ${type}\nData: ${data}`);
      // Auto-reset after 2 seconds
      setTimeout(() => setScanned(false), 2000);
    }
  };

  const captureAndRecognizeText = async () => {
    if (!cameraPermission?.granted) {
      Alert.alert('Permission needed', 'Camera permission is required for OCR');
      return;
    }

    try {
      setIsProcessing(true);
      // Use ImagePicker to capture from camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        // Process image for better OCR results
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: 1920 } }], // Resize for better performance
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Perform text recognition
        try {
          const result = await TextRecognition.recognize(manipulatedImage.uri);
          const detectedText = result.text || 'No text detected';
          setRecognizedText(detectedText);
          
          if (result.text && result.text.trim().length > 0) {
            Alert.alert('Text Recognized!', `Found ${result.text.length} characters`);
          } else {
            Alert.alert('No Text Found', 'Try getting closer to the text or improving lighting');
          }
        } catch (ocrError) {
          console.error('Text recognition error:', ocrError);
          // If ML Kit doesn't work in Expo Go, show helpful message
          if (ocrError.message && ocrError.message.includes('Native')) {
            Alert.alert(
              'Custom Build Required',
              'Text recognition requires a custom development build. For now, barcode scanning works in Expo Go!'
            );
            setRecognizedText('Text recognition requires custom build. Use barcode mode for now.');
          } else {
            throw ocrError;
          }
        }
      }
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('Error', 'Failed to recognize text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cameraPermission === null || barcodePermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted || !barcodePermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission is required</Text>
        <Button title="Grant Permission" onPress={requestCameraPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Camera View */}
      <View style={styles.cameraContainer}>
        {mode === 'barcode' ? (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
            style={StyleSheet.absoluteFillObject}
            barCodeTypes={BarCodeScanner.Constants.BarCodeType}
          />
        ) : (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
          />
        )}
        
        {/* Overlay */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop}>
            <Text style={styles.overlayText}>
              {mode === 'barcode' ? 'Point at a barcode' : 'Point at text to scan'}
            </Text>
          </View>
          <View style={styles.scanArea} />
          <View style={styles.overlayBottom} />
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'barcode' && styles.modeButtonActive]}
          onPress={() => setMode('barcode')}
        >
          <Text style={[styles.modeButtonText, mode === 'barcode' && styles.modeButtonTextActive]}>
            Barcode
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.modeButton, mode === 'ocr' && styles.modeButtonActive]}
          onPress={() => setMode('ocr')}
        >
          <Text style={[styles.modeButtonText, mode === 'ocr' && styles.modeButtonTextActive]}>
            OCR Text
          </Text>
        </TouchableOpacity>
        
        {mode === 'ocr' && (
          <TouchableOpacity
            style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
            onPress={captureAndRecognizeText}
            disabled={isProcessing}
          >
            <Text style={styles.captureButtonText}>
              {isProcessing ? 'Processing...' : 'Capture & Scan Text'}
            </Text>
          </TouchableOpacity>
        )}
        
        {mode === 'barcode' && scanned && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.resetButtonText}>Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      <ScrollView style={styles.results}>
        {mode === 'barcode' && barcodeData.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>Scanned Barcodes:</Text>
            {barcodeData.map((barcode, index) => (
              <View key={index} style={styles.barcodeItem}>
                <Text style={styles.barcodeType}>{barcode.type}</Text>
                <Text style={styles.barcodeData}>{barcode.data}</Text>
                <Text style={styles.barcodeTime}>{barcode.timestamp}</Text>
              </View>
            ))}
          </View>
        )}
        
        {mode === 'ocr' && recognizedText && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>Recognized Text:</Text>
            <View style={styles.textContainer}>
              <Text style={styles.recognizedText}>{recognizedText}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanArea: {
    flex: 2,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    margin: 20,
    backgroundColor: 'transparent',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  controls: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  modeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#333',
    marginHorizontal: 5,
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  captureButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#34C759',
    marginHorizontal: 5,
  },
  captureButtonDisabled: {
    backgroundColor: '#666',
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FF9500',
    marginHorizontal: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  results: {
    maxHeight: 200,
    backgroundColor: '#1a1a1a',
  },
  resultSection: {
    padding: 15,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  barcodeItem: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  barcodeType: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  barcodeData: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  barcodeTime: {
    color: '#999',
    fontSize: 12,
  },
  textContainer: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
  },
  recognizedText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});
