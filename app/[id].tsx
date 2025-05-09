import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Alert, Platform, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFilters } from '@/store/filters';

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
  const primaryColor = useThemeColor({}, 'primaryColor')
  const router = useRouter();

  const { setFilter } = useFilters()

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
      month: 'long',
      day: 'numeric',
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
            <Image
              source={imageDetails?.path}
              style={[styles.mainImage, { height: imageHeight }]}
              contentFit="cover"
              transition={300}
              onLoad={() => setImageLoaded(true)}
            />
            {imageLoaded &&
              <>
                <View style={styles.imageOverlayDownload}>
                  <TouchableOpacity onPress={downloadImage}>
                    <Feather name="download" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={styles.imageOverlayShare}>
                  <TouchableOpacity onPress={shareImage}>
                    <Feather name="share-2" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={styles.imageOverlayZoom}>
                  <TouchableOpacity onPress={() => setShowZoom(true)}>
                    <Feather name="maximize" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </>
            }
          </AutoSkeletonView>

          <ThemedView style={styles.detailsCard}>
            <ThemedText style={styles.detailsHeader}>Image Information</ThemedText>
            <ThemedView style={styles.detailsGroup}>
              <DetailItem label="Resolution" value={imageDetails?.resolution} />
              <DetailItem label="Size" value={formatFileSize(imageDetails?.file_size)} />
              <DetailItem label="Format" value={imageDetails?.file_type?.split('/')[1]?.toUpperCase()} />
            </ThemedView>

            <ThemedView style={styles.divider} />

            <ThemedView style={styles.detailsGroup}>
              <DetailItem label="Views" value={imageDetails?.views.toLocaleString()} />
              <DetailItem label="Uploaded" value={formatDate(imageDetails?.created_at)} />
            </ThemedView>

            {imageDetails?.tags?.length > 0 && (
              <>
                <ThemedView style={styles.divider} />
                <ThemedText style={styles.tagsHeader}>Tags</ThemedText>
                <ThemedView style={styles.tagsContainer}>
                  {imageDetails.tags.map((tag: any, index: number) => (
                    <ThemedView key={index} style={[styles.tagItem, { backgroundColor: primaryColor }]}>
                      <TouchableOpacity onPress={() => {
                        setFilter('q', tag.name)
                        router.push('/')
                      }}>
                        <ThemedText style={styles.tagText}>{tag.name}</ThemedText>
                      </TouchableOpacity>
                    </ThemedView>
                  ))}
                </ThemedView>
              </>
            )}
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
  mainImage: {
    width: '100%',
  },
  imageOverlayZoom: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  imageOverlayDownload: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  imageOverlayShare: {
    position: 'absolute',
    bottom: 15,
    left: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  fullScreenImage: {
    width: '100%',
  },
  imageWrapper: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },


  detailsCard: {
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  detailsGroup: {
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontWeight: '500',
    fontSize: 15,
    opacity: 0.8,
  },
  detailValue: {
    fontWeight: '600',
    fontSize: 15,
  },
  divider: {
    height: 1,
    opacity: 0.1,
    marginVertical: 12,
  },
  tagsHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tagItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default ImageDetails;
