import { Platform, PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export const requestStoragePermission = async () => {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        // For Android 13 and above
        return true; // Android 13+ doesn't need storage permission for app's own files
      } else if (Platform.Version >= 30) {
        // For Android 11 and 12
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to save PDF files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return result === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // For Android 10 and below
        const results = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
        
        return Object.values(results).every(
          result => result === PermissionsAndroid.RESULTS.GRANTED
        );
      }
    }
    return true; // iOS doesn't need these permissions
  } catch (err) {
    console.error('Error requesting storage permission:', err);
    return false;
  }
};

export const ensureDownloadDirectory = async () => {
  try {
    // Get the appropriate directory path
    const basePath = Platform.OS === 'android' 
      ? RNFetchBlob.fs.dirs.DownloadDir
      : RNFetchBlob.fs.dirs.DocumentDir;
    
    const downloadDir = `${basePath}/Payslips`;
    
    // Check if directory exists
    const exists = await RNFetchBlob.fs.exists(downloadDir);
    if (!exists) {
      // Create directory if it doesn't exist
      await RNFetchBlob.fs.mkdir(downloadDir);
      console.log('Created directory:', downloadDir);
    }
    
    return downloadDir;
  } catch (err) {
    console.error('Error ensuring download directory:', err);
    throw err;
  }
};
