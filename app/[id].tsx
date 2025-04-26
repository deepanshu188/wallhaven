import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Share, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatFileSize } from '@/utils/formatFileSize';
import { useQuery } from '@tanstack/react-query';


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

  useEffect(() => {
    navigation.setOptions({ title: 'Image Details' });
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageDetails?.path }} style={styles.fullScreenImage} />
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={downloadImage} style={styles.iconButton}>
            <Feather name="download" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareImage} style={styles.iconButton}>
            <Feather name="share-2" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <DetailItem label="File Size" value={formatFileSize(imageDetails?.file_size)} />
        <DetailItem label="File Type" value={imageDetails?.file_type} />
        <DetailItem label="Views" value={imageDetails?.views} />
        <DetailItem label="Date" value={imageDetails?.created_at} />
        <DetailItem label="Resolution" value={imageDetails?.resolution} />
      </View>
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
  imageWrapper: {
    width: '100%',
    height: '80%',
    position: 'relative',
    paddingTop: 20,
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
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
