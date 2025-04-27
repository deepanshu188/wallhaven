import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, Text, Platform, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { Share } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatFileSize } from '@/utils/formatFileSize';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { ThemedView } from '../app/components/ThemedView';
import { ThemeContext } from './contexts/ThemeContexts';

const DetailItem = ({ label, value }: { label: string; value?: string | number }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const ImageDetails = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const { data: imageDetailsData, isLoading: loading } = useQuery(
    {
      queryKey: ['imageDetails', id],
      queryFn: () => fetch(`https://wallhaven.cc/api/v1/w/${id}`).then(res => res.json()),
    }
  );

  const imageDetails = imageDetailsData?.data;
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setOptions({
      title: 'Image Details',
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
    });

  }, [id]);

  const shareImage = async () => {
    try {
      if (!imageDetails?.path) return;
      await Share.share({
        message: `Check out this wallpaper: ${imageDetails.path}`,
        url: imageDetails.path,
        title: 'Wallhaven Wallpaper',
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Share failed', 'There was an error sharing the image.');
    }
  };

  const downloadImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photo library to download images.');
        return;
      }
      const fileExtension = !!imageDetails?.file_type && imageDetails?.file_type.split('/')[1];
      const fileUri = FileSystem.documentDirectory + `${id}.${fileExtension}`;
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
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={imageDetails?.path} style={styles.fullScreenImage} />
        <View style={styles.overlayContainer}>
          <TouchableOpacity onPress={downloadImage} style={styles.iconButton}>
            <Feather name="download" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareImage} style={styles.iconButton}>
            <Feather name="share-2" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <ThemedView style={styles.detailsContainer}>
        <DetailItem label="File Size" value={formatFileSize(imageDetails?.file_size)} />
        <DetailItem label="File Type" value={imageDetails?.file_type} />
        <DetailItem label="ThemedViews" value={imageDetails?.views} />
        <DetailItem label="Date" value={imageDetails?.created_at} />
        <DetailItem label="Resolution" value={imageDetails?.resolution} />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
  imageWrapper: {
    width: '100%',
    height: '80%',
    position: 'relative',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 20, // Place the icons at the bottom of the image
    left: 0,
    right: 0, // This ensures the icons are centered horizontally within the image container
    alignItems: 'center', // Center the icons horizontally
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 10,
    zIndex: 1, // Ensure the icons are above the image
  },
  iconButton: {
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
  },
  detailsContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#aaa',
    fontWeight: '600',
  },
  detailValue: {
    color: '#fff',
    fontWeight: '400',
  },
});

export default ImageDetails;
