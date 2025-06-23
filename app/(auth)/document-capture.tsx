import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, ActivityIndicator, Alert, Platform, Linking, ViewStyle, TextStyle, ImageStyle, StyleProp, Animated, TextInput } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FaceDetector from 'expo-face-detector';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import DocumentPreviewScreen from './document-preview';
import { useApplication } from '../../context/ApplicationContext';
import { ApplicationData } from '../../types/application';
import { saveTempData, getTempData, clearTempData } from '@/utils/tempStorage';


type DocumentType = 'ghanaCardFront' | 'ghanaCardBack' | 'selfie';



interface DocumentCaptureData {
  ghanaCardNumber?: string;
  ghanaCardFront?: string;
  ghanaCardBack?: string;
  selfie?: string;
}

type LoadingState = {
  isCapturing: boolean;
  isUploading: boolean;
  isSubmitting: boolean;
  isCheckingQuality: boolean;
  isProcessing: boolean;
};

interface ImageQualityCheck {
  passed: boolean;
  message: string;
}

interface CornerStyles {
  topLeft: ViewStyle;
  topRight: ViewStyle;
  bottomLeft: ViewStyle;
  bottomRight: ViewStyle;
}

interface CameraDevice {
  position: 'front' | 'back';
  // Add other camera device properties as needed
}

type DocumentCaptureStyles = {
  container: ViewStyle;
  content: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  cameraContainer: ViewStyle;
  camera: ViewStyle;
  cameraOverlay: ViewStyle;
  idFrame: ViewStyle;
  idFrameCorners: ViewStyle;
  overlayText: TextStyle;
  cameraButtons: ViewStyle;
  captureButton: ViewStyle;
  captureButtonInner: ViewStyle;
  scrollContainer: ViewStyle;
  progressContainer: ViewStyle;
  progressStep: ViewStyle;
  progressStepActive: ViewStyle;
  progressLine: ViewStyle;
  header: ViewStyle;
  documentPreview: ViewStyle;
  previewImage: ImageStyle;
  placeholderContainer: ViewStyle;
  placeholderText: TextStyle;
  buttonsContainer: ViewStyle;
  button: ViewStyle;
  primaryButton: ViewStyle;
  secondaryButton: ViewStyle;
  disabledButton: ViewStyle;
  buttonText: TextStyle;
  primaryButtonText: TextStyle;
  secondaryButtonText: TextStyle;
  idFramePreview: ViewStyle;
  submitButton: ViewStyle;
  submitButtonText: TextStyle;
  faceFrame: ViewStyle;
  faceFrameCorners: ViewStyle;
  faceFrameContainer: ViewStyle;
  faceGuideLines: ViewStyle;
  faceGuideLine: ViewStyle;
  faceInstructions: TextStyle;
  faceSubInstructions: TextStyle;
  facePositionIndicator: ViewStyle;
  facePositionArrow: TextStyle;
  faceTipsContainer: ViewStyle;
  faceTipText: TextStyle;
  wellPositionedFrame: ViewStyle;
  previewGrid: ViewStyle;
  previewItem: ViewStyle;
  previewLabel: TextStyle;
  transitionOverlay: ViewStyle;
  transitionText: TextStyle;
  ghanaCardInput: ViewStyle;
  inputContainer: ViewStyle;
  input: TextStyle;
  inputLabel: TextStyle;
  errorText: TextStyle;
  clearButton: ViewStyle;
  headerTitle: TextStyle;
  backButton: ViewStyle;
  corner: ViewStyle;
  topLeft: ViewStyle;
  topRight: ViewStyle;
  bottomLeft: ViewStyle;
  bottomRight: ViewStyle;
  frameLabel: TextStyle;
  instructionsText: TextStyle;
  cameraWrapper: ViewStyle;
};

export default function DocumentCaptureScreen() {

  const { setLastAuthStep } = useApplication();

  useEffect(() => {
    setLastAuthStep('document-capture'); // this identifies the current step
  }, []);

  const [ghanaCardNumber, setGhanaCardNumber] = useState<string>('');
  const [ghanaCardError, setGhanaCardError] = useState<string>('');

  useEffect(() => {
    const loadSavedCardNumber = async () => {
      const saved = await getTempData('documentCapture') as { ghanaCardNumber?: string };
      if (saved?.ghanaCardNumber) {
        setGhanaCardNumber(saved.ghanaCardNumber);
      }
    };
    loadSavedCardNumber();
  }, []);
  
  

  const router = useRouter();
  const { setApplicationData, applicationData } = useApplication();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DocumentType>('ghanaCardFront');
  const [capturedImages, setCapturedImages] = useState<Record<DocumentType, string | null>>({
    ghanaCardFront: null,
    ghanaCardBack: null,
    selfie: null
  });
  const [loadingState, setLoadingState] = useState({
    isCapturing: false,
    isCheckingQuality: false,
    isUploading: false,
    isSubmitting: false,
    isProcessing: false
  });
  const cameraRef = useRef<any>(null);
  const [isWellPositioned, setIsWellPositioned] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
 

    // ✅ Save card number anytime it updates
    useEffect(() => {
      const saveData: DocumentCaptureData = { ghanaCardNumber };
      saveTempData('documentCapture', saveData);
    }, [ghanaCardNumber]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (showPreview) {
      router.push('/document-preview');
    }
  }, [showPreview]);

  const checkImageQuality = async (uri: string): Promise<ImageQualityCheck> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);

      if (!fileInfo.exists) {
        return { passed: false, message: 'Image file not found' };
      }

      // Check file size (max 5MB)
      if (fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
        return { passed: false, message: 'Image size exceeds 5MB limit' };
      }

      return { passed: true, message: 'Image quality check passed' };
    } catch (error) {
      return { passed: false, message: 'Failed to check image quality' };
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setCameraVisible(true);
    }
  };

  const fadeOut = () => {
    return new Promise<void>((resolve) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => resolve());
    });
  };

  const fadeIn = () => {
    return new Promise<void>((resolve) => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => resolve());
    });
  };

  const transitionToNextDocument = async (nextDoc: DocumentType) => {
    try {
      // Fade out current view
      await new Promise<void>((resolve) => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => resolve());
      });

      // Update document type
      setCurrentDocument(nextDoc);

      // Reset position and fade in
      slideAnim.setValue(100);
      await new Promise<void>((resolve) => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => resolve());
      });
    } catch (error) {
      console.error('Error during transition:', error);
    }
  };

  const handleImageCapture = async (imageUri: string) => {
    try {
      setLoadingState(prev => ({ ...prev, isCheckingQuality: true }));
      const qualityCheck = await checkImageQuality(imageUri);

      if (!qualityCheck.passed) {
        Alert.alert('Image Quality Issue', qualityCheck.message || 'Please try again with a better quality image');
        return false;
      }

      setCapturedImages(prev => ({
        ...prev,
        [currentDocument]: imageUri
      }));

      // Move to next document type if not selfie
      if (currentDocument === 'ghanaCardFront') {
        await transitionToNextDocument('ghanaCardBack');
      } else if (currentDocument === 'ghanaCardBack') {
        await transitionToNextDocument('selfie');
      } else if (currentDocument === 'selfie') {
        setIsTransitioning(true);
        await fadeOut();
        setCameraVisible(false);
        setShowPreview(true);
        await fadeIn();
        setIsTransitioning(false);
      }

      return true;
    } catch (error) {
      Alert.alert('Error', 'Failed to process image. Please try again.');
      return false;
    } finally {
      setLoadingState(prev => ({ ...prev, isCheckingQuality: false }));
    }
  };


  const clearStoredImages = async () => {
    try {
      setLoadingState(prev => ({ ...prev, isUploading: true }));
  
      const documentDir = FileSystem.documentDirectory;
      if (!documentDir) {
        console.warn('Document directory is not available.');
        Alert.alert('Error', 'Document storage directory not found.');
        return;
      }
  
      // Clear all images from the document directory
      const files = await FileSystem.readDirectoryAsync(documentDir);
      for (const file of files) {
        if (file.startsWith('image-')) {
          await FileSystem.deleteAsync(`${documentDir}${file}`);
        }
      }
  
      // Reset the captured images state
      setCapturedImages({
        ghanaCardFront: null,
        ghanaCardBack: null,
        selfie: null
      });
  
      // Reset application context
      if (applicationData) {
        setApplicationData({
          ...applicationData,
          identityInfo: {
            ...applicationData.identityInfo,
            ghanaCardFront: '',
            ghanaCardBack: ''
          },
          selfieInfo: {
            ...applicationData.selfieInfo,
            selfie: ''
          }
        });
      }
  
      Alert.alert('Success', 'All stored images have been cleared.');
    } catch (error) {
      console.error('Error clearing images:', error);
      Alert.alert('Error', 'Failed to clear stored images.');
    } finally {
      setLoadingState(prev => ({ ...prev, isUploading: false }));
    }
  };
  
  
  const saveImageToPermanentLocation = async (uri: string): Promise<string> => {
    try {
      // Check if the URI is already in the document directory
      if (uri.startsWith(FileSystem.documentDirectory || '')) {
        return uri; // Already in permanent storage, no need to copy
      }
  
      // Compress the image first
      const compressed = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
  
      // Check if documentDirectory is available
      if (!FileSystem.documentDirectory) {
        throw new Error('Document directory is not available');
      }
  
      // Generate a unique filename and target URI
      const timestamp = Date.now();
      const newUri = `${FileSystem.documentDirectory}image-${timestamp}.jpg`;
  
      // Copy image to permanent storage
      await FileSystem.copyAsync({
        from: compressed.uri,
        to: newUri,
      });
  
      return newUri;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  };
  
  

  const pickImage = async () => {
    try {
      setLoadingState(prev => ({ ...prev, isUploading: true }));

      // First, just pick the image without editing
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false, // Disable the built-in editor
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        try {
          // Save the original image temporarily
          const tempUri = await saveImageToPermanentLocation(result.assets[0].uri);

          // Show a dialog with options
          Alert.alert(
            'Edit Image',
            'Would you like to crop this image?',
            [
              {
                text: 'Use As Is',
                onPress: async () => {
                  await processSelectedImage(tempUri);
                }
              },
              {
                text: 'Crop Image',
                onPress: async () => {
                  // Now open the image picker again with editing enabled
                  const editResult = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: currentDocument === 'selfie' ? [1, 1] : [4, 3],
                    quality: 0.8,
                  });

                  if (!editResult.canceled && editResult.assets[0]) {
                    await processSelectedImage(editResult.assets[0].uri);
                  } else {
                    // If user cancels editing, use the original image
                    await processSelectedImage(tempUri);
                  }
                }
              },
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: async () => {
                  // Clean up the temporary image
                  try {
                    await FileSystem.deleteAsync(tempUri);
                  } catch (error) {
                    console.error('Error cleaning up image:', error);
                  }
                  setLoadingState(prev => ({ ...prev, isUploading: false }));
                }
              }
            ]
          );
        } catch (error) {
          console.error('Error saving image:', error);
          Alert.alert('Error', 'Failed to save image. Please try again.');
          setLoadingState(prev => ({ ...prev, isUploading: false }));
        }
      } else {
        setLoadingState(prev => ({ ...prev, isUploading: false }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      setLoadingState(prev => ({ ...prev, isUploading: false }));
    }
  };

  const processSelectedImage = async (imageUri: string) => {
    try {
      // Save image to permanent location
      const permanentUri = await saveImageToPermanentLocation(imageUri);

      // Show confirmation dialog
      Alert.alert(
        'Confirm Selection',
        'Do you want to use this image?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: async () => {
              // Clean up the saved image if user cancels
              try {
                await FileSystem.deleteAsync(permanentUri);
              } catch (error) {
                console.error('Error cleaning up image:', error);
              }
              setLoadingState(prev => ({ ...prev, isUploading: false }));
            }
          },
          {
            text: 'Use This Image',
            onPress: async () => {
              try {
                const qualityCheck = await checkImageQuality(permanentUri);
                if (qualityCheck.passed) {
                  const newImages = { ...capturedImages, [currentDocument]: permanentUri };
                  setCapturedImages(newImages);

                  // Update application context
                  if (applicationData) {
                    const updatedData: Partial<ApplicationData> = {
                      identityInfo: {
                        ghanaCardNumber: applicationData.identityInfo?.ghanaCardNumber || '',
                        ghanaCardFront: currentDocument === 'ghanaCardFront' ? permanentUri : (capturedImages.ghanaCardFront || ''),
                        ghanaCardBack: currentDocument === 'ghanaCardBack' ? permanentUri : (capturedImages.ghanaCardBack || '')
                      },
                      selfieInfo: {
                        selfie: currentDocument === 'selfie' ? permanentUri : (capturedImages.selfie || '')
                      }
                    };
                    setApplicationData(updatedData);
                  }

                  // Move to next document or show preview
                  const nextDoc = getNextDocument(currentDocument);
                  if (nextDoc) {
                    setCurrentDocument(nextDoc);
                  } else {
                    setShowPreview(true);
                  }
                } else {
                  // Clean up the saved image if quality check fails
                  try {
                    await FileSystem.deleteAsync(permanentUri);
                  } catch (error) {
                    console.error('Error cleaning up image:', error);
                  }
                  Alert.alert('Quality Check Failed', qualityCheck.message);
                }
              } catch (error) {
                // Clean up the saved image if there's an error
                try {
                  await FileSystem.deleteAsync(permanentUri);
                } catch (cleanupError) {
                  console.error('Error cleaning up image:', cleanupError);
                }
                console.error('Error processing image:', error);
                Alert.alert('Error', 'Failed to process image. Please try again.');
              } finally {
                setLoadingState(prev => ({ ...prev, isUploading: false }));
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
      setLoadingState(prev => ({ ...prev, isUploading: false }));
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || loadingState.isCapturing) return;

    try {
      setLoadingState(prev => ({ ...prev, isCapturing: true }));
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      // Save image to permanent location
      const permanentUri = await saveImageToPermanentLocation(photo.uri);

      setLoadingState(prev => ({ ...prev, isCheckingQuality: true }));
      const qualityCheck = await checkImageQuality(permanentUri);

      if (qualityCheck.passed) {
        const newImages = {
          ...capturedImages,
          [currentDocument]: permanentUri
        };
        setCapturedImages(newImages);

        // Update application context
        const updatedData: Partial<ApplicationData> = {
          identityInfo: {
            ghanaCardNumber: applicationData?.identityInfo?.ghanaCardNumber || '',
            ghanaCardFront: currentDocument === 'ghanaCardFront' ? permanentUri : capturedImages.ghanaCardFront,
            ghanaCardBack: currentDocument === 'ghanaCardBack' ? permanentUri : capturedImages.ghanaCardBack
          },
          selfieInfo: {
            selfie: currentDocument === 'selfie' ? permanentUri : capturedImages.selfie
          }
        };
        setApplicationData(updatedData);

        // Move to next document or show preview
        const nextDoc = getNextDocument(currentDocument);
        if (nextDoc) {
          setCurrentDocument(nextDoc);
        } else {
          setShowPreview(true);
        }
      } else {
        Alert.alert('Quality Check Failed', qualityCheck.message);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setLoadingState(prev => ({ ...prev, isCapturing: false, isCheckingQuality: false }));
    }
  };

  const retakePhoto = () => {
    setCapturedImages(prev => {
      const newImages = { ...prev };
      delete newImages[currentDocument];
      return newImages;
    });
  };

  const validateGhanaCardNumber = (number: string) => {
    const regex = /^GHA-\d{9}-\d$/;
    return regex.test(number);
  };

  const handleGhanaCardNumberChange = (text: string) => {
    setGhanaCardNumber(text);
    if (text && !validateGhanaCardNumber(text)) {
      setGhanaCardError('Invalid Ghana Card number format. Use GHA-XXXXXXXXX-X');
    } else {
      setGhanaCardError('');
    }
  };

  const handleSubmit = async () => {
    try {

      await clearTempData('documentCapture');

      setLoadingState(prev => ({ ...prev, isSubmitting: true }));

      // Validate Ghana card number
      if (!ghanaCardNumber) {
        setGhanaCardError('Please enter your Ghana Card number');
        setLoadingState(prev => ({ ...prev, isSubmitting: false }));
        return;
      }

        // Validate Ghana card number format
    if (!validateGhanaCardNumber(ghanaCardNumber)) {
      setGhanaCardError('Invalid Ghana Card number format. Use GHA-XXXXXXXXX-X');
      setLoadingState(prev => ({ ...prev, isSubmitting: false }));
      return;
    }

      // Validate that all required images are captured
      if (!capturedImages.ghanaCardFront || !capturedImages.ghanaCardBack || !capturedImages.selfie) {
        Alert.alert('Error', 'Please capture all required images');
        setLoadingState(prev => ({ ...prev, isSubmitting: false }));
        return;
      }

      // Since we've validated that the images exist, we can safely assert they are not null
      const ghanaCardFront = capturedImages.ghanaCardFront as string;
      const ghanaCardBack = capturedImages.ghanaCardBack as string;
      const selfie = capturedImages.selfie as string;

      // Save all captured images and Ghana card number to application context
     // Example: Update application context and go to next screen
     setApplicationData((prev: ApplicationData) => ({
      ...prev,
      identityInfo: {
        ...prev.identityInfo,
        ghanaCardFront: '',
        ghanaCardBack: '',
      },
      selfieInfo: {
        ...prev.selfieInfo,
        selfie: '',
      },
    }));
    
// Navigate or show success
Alert.alert('Success', 'Identity information submitted successfully!');


      //TODO: Upload or next navigation step

      // Show preview
      setShowPreview(true);
    } catch (error) {
      console.error('Error submitting documents:', error);
      Alert.alert('Error', 'Failed to submit documents. Please try again.');
    } finally {
      setLoadingState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const getDocumentTitle = () => {
    switch (currentDocument) {
      case 'ghanaCardFront':
        return 'Ghana Card Front Side';
      case 'ghanaCardBack':
        return 'Ghana Card Back Side';
      case 'selfie':
        return 'Take a Selfie';
      default:
        return '';
    }
  };

  const getDocumentInstructions = () => {
    switch (currentDocument) {
      case 'ghanaCardFront':
        return 'Capture the front side of your Ghana Card with all details clearly visible';
      case 'ghanaCardBack':
        return 'Capture the back side of your Ghana Card with the barcode visible';
      case 'selfie':
        return 'Take a clear selfie with your face centered and visible';
      default:
        return '';
    }
  };

  const getDocumentIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (currentDocument) {
      case 'ghanaCardFront':
        return 'id-card';
      case 'ghanaCardBack':
        return 'id-card';
      case 'selfie':
        return 'person';
      default:
        return 'help';
    }
  };

  const getPreviewAspectRatio = (): number => {
    return currentDocument === 'selfie' ? 1 : 4 / 3;
  };

  const getNextDocument = (currentDoc: DocumentType): DocumentType | null => {
    const docs: DocumentType[] = ['ghanaCardFront', 'ghanaCardBack', 'selfie'];
    const currentIndex = docs.indexOf(currentDoc);
    return currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null;
  };

  if (cameraVisible) {
    if (hasPermission === null) {
      return <View style={styles.cameraContainer}><ActivityIndicator size="large" color="#0000ff" /></View>;
    }
    if (hasPermission === false) {
      return (
        <View style={styles.cameraContainer}>
          <Text style={styles.overlayText}>No access to camera</Text>
          <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <Animated.View style={[
            styles.cameraWrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }]
            }
          ]}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={currentDocument === 'selfie' ? 'front' : 'back'}
            >
              <View style={styles.cameraOverlay}>
                {currentDocument === 'selfie' ? (
                  <View style={styles.faceFrameContainer}>
                    <View style={styles.faceFrame}>
                      <View style={styles.faceFrameCorners}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                      </View>
                    </View>
                    <View style={styles.faceGuideLines}>
                      <View style={styles.faceGuideLine} />
                      <View style={styles.faceGuideLine} />
                    </View>
                    <Text style={styles.faceInstructions}>Position your face in the frame</Text>
                    <Text style={styles.faceSubInstructions}>Look directly at the camera</Text>
                  </View>
                ) : (
                  <>
                    <Text style={[styles.overlayText, styles.frameLabel]}>
                      {currentDocument === 'ghanaCardFront' ? 'Front Side' : 'Back Side'}
                    </Text>
                    <View style={styles.idFrame}>
                      <View style={styles.idFrameCorners}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                      </View>
                    </View>
                    <Text style={[styles.overlayText, styles.instructionsText]}>
                      {isWellPositioned
                        ? 'Perfect! Hold still'
                        : 'Position your ID within the frame'}
                    </Text>
                  </>
                )}
              </View>
            </CameraView>
          </Animated.View>
          <View style={styles.cameraButtons}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              disabled={loadingState.isCapturing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
        {isTransitioning && (
          <View style={styles.transitionOverlay}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.transitionText}>Processing...</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Document Capture</Text>
          <TouchableOpacity onPress={clearStoredImages} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        <View style={styles.ghanaCardInput}>
          <Text style={styles.inputLabel}>Ghana Card Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={ghanaCardNumber}
              onChangeText={handleGhanaCardNumberChange}
              placeholder="GHA-XXXXXXXXX-X"
              placeholderTextColor="#999"
            />
          </View>
          {ghanaCardError ? <Text style={styles.errorText}>{ghanaCardError}</Text> : null}
        </View>

        <View style={styles.progressContainer}>
          {(['ghanaCardFront', 'ghanaCardBack', 'selfie'] as DocumentType[]).map((doc, index) => (
            <React.Fragment key={doc}>
              <View style={[
                styles.progressStep,
                (currentDocument === doc || capturedImages[doc]) && styles.progressStepActive
              ]}>
                <Ionicons
                  name={capturedImages[doc] ? 'checkmark' : (() => {
                    switch (doc) {
                      case 'ghanaCardFront':
                      case 'ghanaCardBack':
                        return 'id-card';
                      case 'selfie':
                        return 'person';
                      default:
                        return 'help';
                    }
                  })()}
                  size={16}
                  color="white"
                />
              </View>
              {index < 2 && <View style={styles.progressLine} />}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.header}>
          <Ionicons name={getDocumentIcon()} size={32} color="#411D4B" />
          <Text style={styles.title}>{getDocumentTitle()}</Text>
          <Text style={styles.subtitle}>{getDocumentInstructions()}</Text>
        </View>

        <View style={[styles.documentPreview, { aspectRatio: getPreviewAspectRatio() }]}>
          {capturedImages[currentDocument] && capturedImages[currentDocument]?.trim() !== '' ? (
            <>
              <Image
                source={{ uri: capturedImages[currentDocument]?.trim() }}
                style={styles.previewImage}
                resizeMode="contain"
                onError={(error) => {
                  console.error('Image loading error:', error.nativeEvent.error);
                  // Clear invalid image
                  setCapturedImages(prev => ({
                    ...prev,
                    [currentDocument]: null
                  }));
                }}
              />
              {currentDocument !== 'selfie' && (
                <View style={styles.idFramePreview}>
                  <View style={styles.idFrameCorners as StyleProp<ViewStyle>} />
                </View>
              )}
            </>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons
                name={getDocumentIcon()}
                size={48}
                color="#411D4B"
                style={{ opacity: 0.5 } as TextStyle}
              />
              <Text style={styles.placeholderText}>
                {currentDocument === 'selfie'
                  ? 'No selfie captured yet'
                  : 'No photo captured yet'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          {capturedImages[currentDocument] ? (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={retakePhoto}
              disabled={loadingState.isCapturing || loadingState.isUploading}
            >
              <Ionicons name="camera-reverse" size={20} color="#411D4B" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Retake</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={pickImage}
                disabled={loadingState.isCapturing || loadingState.isUploading}
              >
                {loadingState.isUploading ? (
                  <ActivityIndicator size="small" color="#411D4B" />
                ) : (
                  <>
                    <Ionicons name="image" size={20} color="#411D4B" />
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>Upload from Gallery</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={requestCameraPermission}
                disabled={loadingState.isCapturing || loadingState.isUploading}
              >
                {loadingState.isCapturing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Text style={[styles.buttonText, styles.primaryButtonText]}>Take Photo</Text>
                    <Ionicons name="camera" size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {Object.values(capturedImages).every(Boolean) && (
          <TouchableOpacity
            style={[styles.submitButton, loadingState.isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loadingState.isSubmitting}
          >
            {loadingState.isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Submit All Documents</Text>
                <Ionicons name="checkmark-circle" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<DocumentCaptureStyles>({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#411D4B',
    textAlign: 'center',
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#411D4B',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  idFrame: {
    width: '80%',
    aspectRatio: 1.586,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 8,
  },
  idFrameCorners: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cameraButtons: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#B8DEE6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: '#411D4B',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#B8DEE6',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  documentPreview: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: 1.586,
    borderWidth: 1,
    borderColor: '#411D4B',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#411D4B',
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#411D4B',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#411D4B',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: 'white',
  },
  secondaryButtonText: {
    color: '#411D4B',
  },
  idFramePreview: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: 'rgba(65, 29, 75, 0.5)',
    borderRadius: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#411D4B',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  faceFrameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  faceFrame: {
    width: '80%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 200,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  faceFrameCorners: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 200,
  },
  faceGuideLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuideLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  faceInstructions: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  faceSubInstructions: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  facePositionIndicator: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  facePositionArrow: {
    opacity: 0.7,
  },
  faceTipsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  faceTipText: {
    color: 'white',
    fontSize: 12,
    marginVertical: 2,
    textAlign: 'center',
  },
  wellPositionedFrame: {
    borderColor: '#4CAF50',
    borderWidth: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  previewGrid: {
    gap: 16,
    marginVertical: 24,
  },
  previewItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#411D4B',
    marginBottom: 8,
  },
  transitionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transitionText: {
    color: 'white',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '600',
  },
  ghanaCardInput: {
    marginBottom: 24,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
    color: '#411D4B',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  clearButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#411D4B',
    textAlign: 'center',
    marginVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'white',
    borderWidth: 2,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  frameLabel: {
    marginBottom: 20,
    marginTop: -40,
  },
  instructionsText: {
    marginTop: 20,
  },
  cameraWrapper: {
    flex: 1,
    width: '100%',
  },
});