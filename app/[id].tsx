import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Alert, Platform, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { Share } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatFileSize } from '@/utils/formatFileSize';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import ThemedView from '../app/components/ThemedView';
import Theme from './contexts/ThemeContexts';
import ThemedText from './components/ThemedText';
import { api } from '@/axiosConfig';
import { AutoSkeletonView } from 'react-native-auto-skeleton';
import Loader from '@/app/components/Loader';
import { Zoomable } from '@likashefqet/react-native-image-zoom';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const DetailItem = ({ label, value }: { label: string; value?: string | number }) => (
  <ThemedView style={styles.detailItem}>
    <ThemedText style={styles.detailLabel}>{label}</ThemedText>
    <ThemedText style={styles.detailValue}>{value}</ThemedText>
  </ThemedView>
);

const ImageDetails = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  const fetchImageDetails = async () => {
    const response = await api.get(`https://wallhaven.cc/api/v1/w/${id}`);
    return response.data;
  };

  const { data: imageDetailsData, isLoading: loading } = useQuery(
    {
      queryKey: ['imageDetails', id],
      queryFn: fetchImageDetails,
    }
  );

  const imageDetails = imageDetailsData?.data;
  const { theme } = useContext(Theme.ThemeContext);

  const [imageHeight, setImageHeight] = useState(300);

  useEffect(() => {
    if (imageDetails) {
      const aspectRatio = imageDetails.dimension_x / imageDetails.dimension_y;
      const screenWidth = Dimensions.get('window').width;
      const calculatedHeight = screenWidth / aspectRatio;
      setImageHeight(calculatedHeight);
    }
  }, [imageDetails]);

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
        <Loader />
      </ThemedView>
    );
  }

  const formatDate = (date: string) => {
    if (!date) return '';
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return dateObj.toLocaleDateString('en-US', options);
  }

  return (
    <>
      <Modal animationType="fade" visible={showZoom} onRequestClose={() => setShowZoom(false)} backdropColor="black">
        <GestureHandlerRootView>
          <Zoomable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} doubleTapScale={3} isDoubleTapEnabled>
            <Image
              source={imageDetails?.path}
              style={[styles.fullScreenImage, { height: imageHeight }]}
            />
          </Zoomable>
        </GestureHandlerRootView>
      </Modal>
      <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={[styles.imageWrapper, { width: '100%' }]}>
          <AutoSkeletonView
            isLoading={!imageLoaded}
            shimmerBackgroundColor="#333"
            animationType='pulse'
            shimmerSpeed={1}
          >
            <TouchableOpacity onPress={() => setShowZoom(true)}>
              <Image
                source={imageDetails?.path}
                style={[styles.fullScreenImage, { height: imageHeight }]}
                onLoad={() => setImageLoaded(true)}
              />
            </TouchableOpacity>
          </AutoSkeletonView>
          <ThemedView style={[styles.detailsContainer, { marginTop: 20 }]}>
            <ThemedView style={styles.buttonsContainer}>
              <TouchableOpacity onPress={downloadImage} style={styles.iconButton}>
                <Feather name="download" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={shareImage} style={styles.iconButton}>
                <Feather name="share-2" size={24} color="white" />
              </TouchableOpacity>
            </ThemedView>
            <DetailItem label="Size" value={formatFileSize(imageDetails?.file_size)} />
            <DetailItem label="Type" value={imageDetails?.file_type} />
            <DetailItem label="Views" value={imageDetails?.views.toLocaleString()} />
            <DetailItem label="Date" value={formatDate(imageDetails?.created_at)} />
            <DetailItem label="Resolution" value={imageDetails?.resolution} />
          </ThemedView>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
  },
  imageWrapper: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  buttonsContainer: {
    flex: 1,
    marginBottom: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 10,
  },
  iconButton: {
    padding: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
  },
  detailsContainer: {
    width: '96%',
    borderRadius: 10,
    padding: 15,
    margin: 'auto',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '600',
  },
  detailValue: {
    fontWeight: '400',
  },
});

export default ImageDetails;
