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

const SearchScreen = () => {
  const [files, setFiles] = React.useState([]);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [imageHeight, setImageHeight] = React.useState(300);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const loadFiles = async () => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
    const path = RNFS.PicturesDirectoryPath + "/Wallhaven";
    RNFS.readDir(path)
      .then((contents) => {
        setFiles(contents as any);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useFocusEffect(
    useCallback(() => {
      if (permissionResponse?.granted) {
        loadFiles();
      }
    }, [permissionResponse]),
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

  return (
    <>
      {
        <Modal
          animationType="fade"
          visible={!!selectedFile}
          onRequestClose={() => setSelectedFile(null)}
          backdropColor="black"
        >
          <GestureHandlerRootView>
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
              />
            </Zoomable>
          </GestureHandlerRootView>
        </Modal>
      }
      <ThemedView style={styles.container}>
        {files.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <MaterialIcons name="photo-library" size={70} color="gray" />
            <ThemedText style={styles.emptyText}>
              No downloaded wallpapers
            </ThemedText>
          </ThemedView>
        ) : (
          files?.map((file: any) => {
            return file.isFile() ? (
              <ThemedView key={file.name} style={styles.fileCard}>
                <TouchableOpacity
                  style={styles.imageContainer}
                  onPress={() => handleClickImage(file)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={`file://${file.path}`}
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
                    {file.name}
                  </ThemedText>
                  <ThemedText style={styles.fileSize}>
                    {formatFileSize(file.size)}
                  </ThemedText>
                </View>

                <TouchableOpacity
                  onPress={() => handleDeleteFile(file)}
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
            ) : null;
          })
        )}
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(150, 150, 150, 0.07)",
    shadowColor: "#000",
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  thumbnail: {
    width: 90,
    height: 90,
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
    marginBottom: 6,
    maxWidth: "90%",
  },
  fileSize: {
    fontSize: 14,
    opacity: 0.6,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    marginLeft: 8,
  },
});

export default SearchScreen;
