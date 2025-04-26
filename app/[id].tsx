import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Button, Alert, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WallhavenWallpaperResponse, WallhavenWallpaperResponseData } from '@/types/wallhaven';

const ImageDetails = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [imageDetails, setImageDetails] = useState<WallhavenWallpaperResponseData>();
  const navigation = useNavigation();

  useEffect(() => {
    fetchImage();
    navigation.setOptions({ title: 'Image Details' });
  }, [id]);

  const fetchImage = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://wallhaven.cc/api/v1/w/${id}`);
      const json = await response.json() as WallhavenWallpaperResponse;
      const data = json.data
      setImageDetails(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    try {
      let { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photo library to download images.');
        return;
      }

      const fileUri = FileSystem.documentDirectory + `${id}.jpg`;
      if (!imageDetails?.path) return;
      const { uri } = await FileSystem.downloadAsync(imageDetails?.path, fileUri);

      if (Platform.OS === 'android') {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("Wallhaven", asset, false);
        Alert.alert('Image saved', 'Image has been saved to the Wallhaven album!');
      } else {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Image saved', 'Image has been saved to your photo library.');
      }


    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download failed', 'There was an error downloading the image.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageDetails?.path }} style={styles.fullScreenImage} />
      <Text style={styles.text}>Resolution: {imageDetails?.resolution}</Text>
      <Text style={styles.text}>File Size: {imageDetails?.file_size}</Text>
      <Text style={styles.text}>File Type: {imageDetails?.file_type}</Text>
      <Text style={styles.text}>Views: {imageDetails?.views}</Text>
      <Text style={styles.text}>Date: {imageDetails?.created_at}</Text>
      <Button title="Download Image" onPress={downloadImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  text: {
    color: '#fff',
    marginBottom: 5,
  },
});

export default ImageDetails;
