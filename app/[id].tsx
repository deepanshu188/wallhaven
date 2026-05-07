import React, { useContext, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "@react-navigation/native";
import { Share } from "react-native";
import { Feather } from "@expo/vector-icons";
import { formatFileSize } from "@/utils/formatFileSize";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import ThemedView from "./components/ThemedView";
import Theme from "./contexts/ThemeContexts";
import ThemedText from "./components/ThemedText";
import { api } from "@/axiosConfig";
import { AutoSkeletonView } from "react-native-auto-skeleton";
import Loader from "./components/Loader";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFilters } from "@/store/filters";
import Snackbar from "./components/Snackbar";
import Button from "./components/Button";

const DetailItem = ({
  label,
  value,
}: {
  label: string | React.ReactNode;
  value?: string | number;
}) => (
  <ThemedView style={styles.detailItem}>
    <ThemedText style={styles.detailLabel}>{label}</ThemedText>
    <ThemedText style={styles.detailValue}>{value}</ThemedText>
  </ThemedView>
);

const ImageDetails = () => {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const primaryColor = useThemeColor({}, "primaryColor");
  const router = useRouter();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { setFilter } = useFilters();

  const fetchImageDetails = async () => {
    const response = await api.get(`/w/${id}`);
    return response.data;
  };

  const { data: imageDetailsData, isLoading: loading, isError } = useQuery({
    queryKey: ["imageDetails", id],
    queryFn: fetchImageDetails,
    enabled: !!id,
  });

  const imageDetails = imageDetailsData?.data;
  const { theme } = useContext(Theme.ThemeContext);

  const [imageHeight, setImageHeight] = useState(300);

  useEffect(() => {
    if (imageDetails) {
      const aspectRatio = imageDetails.dimension_x / imageDetails.dimension_y;
      const screenWidth = Dimensions.get("window").width;
      const calculatedHeight = screenWidth / aspectRatio;
      setImageHeight(calculatedHeight);
    }
  }, [imageDetails]);

  useEffect(() => {
    navigation.setOptions({
      title: "Image Details",
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
        title: "Wallhaven Wallpaper",
      });
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Share failed", "There was an error sharing the image.");
    }
  };

  const downloadImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please allow access to your photo library to download images.",
        );
        return;
      }

      const fileExtension = imageDetails?.file_type?.split("/")[1] || 'jpg';
      const fileUri = Paths.document.uri + id + '.' + fileExtension;

      if (!imageDetails?.path) {
        setSnackbarVisible(true);
        setSnackbarMessage("No image path available.");
        return;
      }

      const downloadedFile = await File.downloadFileAsync(
        imageDetails.path,
        new File(fileUri)
      );

      const uri = downloadedFile.uri;

      if (Platform.OS === "android") {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("Wallhaven", asset, false);
        setSnackbarVisible(true);
        setSnackbarMessage("Image saved to the Wallhaven album!");
      } else {
        await MediaLibrary.saveToLibraryAsync(uri);
        setSnackbarVisible(true);
        setSnackbarMessage("Image saved to your photo library.");
      }
    } catch (error) {
      console.error("Download error:", error);
      setSnackbarVisible(true);
      setSnackbarMessage("Download failed. There was an error downloading the image.");
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <Loader />
      </ThemedView>
    );
  }

  if (isError || !imageDetails) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Error loading image details.</ThemedText>
        <Button title="Go Back" onPress={() => router.back()} />
      </ThemedView>
    );
  }

  const formatDate = (date: string) => {
    if (!date) return "";
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return dateObj.toLocaleDateString("en-US", options);
  };

  const handleSearch = (q: string) => {
    setFilter("q", q);
    router.push("/");
  };

  const primaryPurple = "#B1A2FF";
  const darkBg = "#000000";
  const cardBg = "#111113";
  const textSecondary = "#8E8E93";

  return (
    <>
      <Modal
        animationType="fade"
        visible={showZoom}
        onRequestClose={() => setShowZoom(false)}
        transparent={true}
      >
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Zoomable
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
              doubleTapScale={3}
              isDoubleTapEnabled
            >
              <Image
                source={imageDetails?.path}
                style={[styles.fullScreenImage, { height: imageHeight }]}
                contentFit="contain"
              />
            </Zoomable>
            <TouchableOpacity 
              style={styles.closeZoom} 
              onPress={() => setShowZoom(false)}
            >
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
          </GestureHandlerRootView>
        </View>
      </Modal>

      <ScrollView 
        style={{ flex: 1, backgroundColor: darkBg }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageDetails?.path }}
            style={[styles.mainImage, { height: imageHeight }]}
            contentFit="cover"
            transition={300}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#111' }]}>
              <AutoSkeletonView
                isLoading={true}
                shimmerBackgroundColor="#222"
                animationType="pulse"
              >
                <View style={{ width: "100%", height: imageHeight }} />
              </AutoSkeletonView>
            </View>
          )}
          {imageLoaded && (
            <View style={styles.actionOverlay}>
              <TouchableOpacity 
                style={styles.actionCircle} 
                onPress={downloadImage}
              >
                <Feather name="download" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionCircle} 
                onPress={shareImage}
              >
                <Feather name="share-2" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionCircle} 
                onPress={() => setShowZoom(true)}
              >
                <Feather name="maximize" size={22} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={[styles.detailsContainer, { paddingBottom: Math.max(insets.bottom, 20) + 40 }]}>
          {/* Uploader Card */}
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push(`/collections/${imageDetails?.uploader?.username}`)}
          >
            <View style={styles.uploaderRow}>
              <Image
                source={imageDetails?.uploader?.avatar["200px"]}
                style={styles.avatar}
              />
              <View>
                <ThemedText style={styles.uploaderName}>
                  {imageDetails?.uploader?.username}
                </ThemedText>
                <ThemedText style={styles.uploaderRole}>
                  Uploader
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>

          {/* Info Card */}
          <View style={styles.card}>
            <ThemedText style={styles.cardHeader}>Image Description</ThemedText>
            
            <View style={styles.infoGrid}>
              <DetailItem label="Resolution" value={imageDetails?.resolution} />
              <DetailItem label="Format" value={imageDetails?.file_type?.split("/")[1]?.toUpperCase()} />
              <DetailItem label="Size" value={formatFileSize(imageDetails?.file_size)} />
              <DetailItem label="Views" value={imageDetails?.views?.toLocaleString()} />
              <DetailItem label="Created" value={formatDate(imageDetails?.created_at)} />
            </View>

            {imageDetails?.tags?.length > 0 && (
              <>
                <View style={styles.divider} />
                <ThemedText style={[styles.cardHeader, { marginTop: 12 }]}>Tags</ThemedText>
                <View style={styles.tagsContainer}>
                  {imageDetails.tags.map((tag: any, index: number) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.tagPill}
                      onPress={() => handleSearch(tag.name)}
                    >
                      <ThemedText style={styles.tagText}>{tag.name}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>

          <TouchableOpacity 
            style={styles.similarButton}
            onPress={() => handleSearch(`like:${imageDetails?.id}`)}
          >
            <ThemedText style={styles.similarButtonText}>Find Similar Wallpapers</ThemedText>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <Snackbar
        message={snackbarMessage}
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: "100%",
    backgroundColor: '#000',
  },
  mainImage: {
    width: "100%",
  },
  fullScreenImage: {
    width: "100%",
  },
  closeZoom: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 100,
  },
  actionOverlay: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionCircle: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#000',
  },
  card: {
    backgroundColor: "#000000",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  uploaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#B1A2FF',
  },
  uploaderName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  uploaderRole: {
    fontSize: 13,
    color: '#8E8E93',
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: '#fff',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  infoGrid: {
    gap: 4,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagPill: {
    backgroundColor: 'rgba(177, 162, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(177, 162, 255, 0.2)',
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
    color: '#B1A2FF',
  },
  similarButton: {
    height: 56,
    backgroundColor: 'rgba(177, 162, 255, 0.15)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(177, 162, 255, 0.3)',
    marginTop: 8,
  },
  similarButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B1A2FF',
  },
});

export default ImageDetails;
