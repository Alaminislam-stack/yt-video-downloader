import React, { useState } from 'react';
import { StyleSheet, View, Alert, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import Header from './src/components/Header';
import URLInput from './src/components/URLInput';
import VideoCard from './src/components/VideoCard';
import { getVideoInfo } from './src/services/api';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);

  const handleFetch = async (url) => {
    setLoading(true);
    setVideoData(null);
    try {
      const data = await getVideoInfo(url);
      setVideoData(data);
    } catch (error) {
      Alert.alert('Fetch Error', error.message || 'Failed to fetch video information. Please check the URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url, type) => {
    if (!url) {
      Alert.alert('Error', 'Download link not available.');
      return;
    }

    try {
      setLoading(true);
      const filename = `yt_downloader_${Date.now()}.${type}`;
      const fileUri = FileSystem.documentDirectory + filename;

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        },
        (downloadProgress) => {
          // You could implement a progress bar here
        }
      );

      const { uri } = await downloadResumable.downloadAsync();

      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status === 'granted') {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('YT Downloader', asset, false);
        Alert.alert('Success', 'File saved to gallery!');
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Success', `File downloaded to: ${uri}`);
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', `Failed to download: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" />
      <Header />
      <URLInput onFetch={handleFetch} loading={loading} />
      <VideoCard videoData={videoData} onDownload={handleDownload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});
