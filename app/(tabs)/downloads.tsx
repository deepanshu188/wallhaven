import React, { useCallback } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image as NativeImage,
  Dimensions,
  Alert,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import { Image } from "expo-image";
import RNFS from "react-native-fs";
import { formatFileSize } from "@/utils/formatFileSize";
import * as MediaLibrary from "expo-media-library";
import { useFocusEffect } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { MaterialIcons } from "@expo/vector-icons";
import { LegendList, type LegendListRenderItemProps } from "@legendapp/list";
import Loader from "../components/Loader";

interface FileItem {
  ctime: string | null;
  mtime: string | null;
  name: string;
  path: string;
  size: number;
}

const DownloadsScreen = () => {
  const insets = useSafeAreaInsets();
  const [files, setFiles] = React.useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [imageHeight, setImageHeight] = React.useState(300);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const loadFiles = async () => {
    const path = RNFS.PicturesDirectoryPath + "/Wallhaven";
    RNFS.readDir(path)
      .then((contents) => {
        setFiles(contents as any);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      const checkAndLoadFiles = async () => {
        const res = await requestPermission();
        if (res?.granted) {
          loadFiles();
        } else {
          Alert.alert(
            "Permission required",
            "This app needs media library access to show your wallpapers.",
          );
        }
      };

      checkAndLoadFiles();
    }, [requestPermission]),
  );

  const handleClickImage = (file: any) => {
    NativeImage.getSize(
      `file://${file.path}`,
      (width: number, height: number) => {
        const aspectRatio = width / height;
        const screenWidth = Dimensions.get("window").width;
        const calculatedHeight = screenWidth / aspectRatio;
        setImageHeight(calculatedHeight);
      },
    );
    setSelectedFile(file.path);
  };

  const handleDeleteFile = (file: any) => {
    Alert.alert(
      "Delete File",
      `Are you sure you want to delete ${file.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            RNFS.unlink(file.path)
              .then(() => {
                loadFiles();
              })
              .catch((err) => {
                console.log(err);
                Alert.alert("Error", "Failed to delete file");
              });
          },
          style: "destructive",
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.center, { flex: 1 }]}>
        <Loader />
      </ThemedView>
    );
  }

  const ListHeader = () => (
    <View style={styles.profileHeader}>
      <ThemedText style={styles.profileTitle}>Downloads</ThemedText>
    </View>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Modal
        animationType="fade"
        visible={!!selectedFile}
        onRequestClose={() => setSelectedFile(null)}
        transparent={true}
      >
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Zoomable
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              doubleTapScale={3}
              isDoubleTapEnabled
            >
              <Image
                source={`file://${selectedFile}`}
                style={{ width: "100%", height: imageHeight }}
                contentFit="contain"
              />
            </Zoomable>
            <TouchableOpacity 
              style={styles.closeZoom} 
              onPress={() => setSelectedFile(null)}
            >
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </GestureHandlerRootView>
        </View>
      </Modal>

      {files.length === 0 ? (
        <View style={{ flex: 1 }}>
          <ListHeader />
          <ThemedView style={styles.emptyState}>
            <MaterialIcons name="photo-library" size={70} color="gray" />
            <ThemedText style={styles.emptyText}>
              No downloaded wallpapers
            </ThemedText>
          </ThemedView>
        </View>
      ) : (
        <LegendList
          data={files}
          keyExtractor={(item) => item.name}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }: LegendListRenderItemProps<FileItem>) => (
            <ThemedView key={item.name} style={styles.fileCard}>
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => handleClickImage(item)}
                activeOpacity={0.8}
              >
                <Image
                  source={`file://${item.path}`}
                  style={styles.thumbnail}
                  contentFit="cover"
                  transition={200}
                />
              </TouchableOpacity>

              <View style={styles.fileInfo}>
                <ThemedText
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  style={styles.fileName}
                >
                  {item.name}
                </ThemedText>
                <ThemedText style={styles.fileSize}>
                  {formatFileSize(item.size)}
                </ThemedText>
              </View>

              <TouchableOpacity
                onPress={() => handleDeleteFile(item)}
                style={styles.deleteButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={24}
                  color="#ff3b30"
                />
              </TouchableOpacity>
            </ThemedView>
          )}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#000',
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: "gray",
  },
  profileHeader: {
    paddingVertical: 20,
    marginBottom: 10,
  },
  profileTitle: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: '#fff',
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  fileInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  fileName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    maxWidth: "90%",
    color: '#fff',
  },
  fileSize: {
    fontSize: 14,
    opacity: 0.5,
    color: '#fff',
  },
  deleteButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    marginLeft: 8,
  },
  closeZoom: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 100,
  },
});

export default DownloadsScreen;
