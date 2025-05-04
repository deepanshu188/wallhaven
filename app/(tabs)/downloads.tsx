import React, { useCallback } from 'react';
import { Modal, StyleSheet, TouchableOpacity, Image as NativeImage, Dimensions } from 'react-native';
import ThemedView from '../components/ThemedView';
import ThemedText from '../components/ThemedText';
import { Image } from 'expo-image';
import RNFS from 'react-native-fs';
import { formatFileSize } from '@/utils/formatFileSize';
import * as MediaLibrary from 'expo-media-library';
import { useFocusEffect } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Zoomable } from '@likashefqet/react-native-image-zoom';

const SearchScreen = () => {
  const [files, setFiles] = React.useState([]);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [imageHeight, setImageHeight] = React.useState(300);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const loadFiles = async () => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
    const path = RNFS.PicturesDirectoryPath + '/Wallhaven';
    RNFS.readDir(path)
      .then((contents) => { setFiles(contents as any) })
      .catch((err) => {
        console.log(err);
      });
  }

  useFocusEffect(
    useCallback(() => {
      if (permissionResponse?.granted) {
        loadFiles();
      }
    }, [permissionResponse])
  );

  const handleClickImage = (file: any) => {
    NativeImage.getSize(`file://${file.path}`, (width: number, height: number) => {
      const aspectRatio = width / height;
      const screenWidth = Dimensions.get('window').width;
      const calculatedHeight = screenWidth / aspectRatio;
      setImageHeight(calculatedHeight);
    });
    setSelectedFile(file.path);
  }


  return (
    <>
      {
        <Modal animationType="fade" visible={!!selectedFile} onRequestClose={() => setSelectedFile(null)} backdropColor="black">
          <GestureHandlerRootView>
            <Zoomable style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} doubleTapScale={3} isDoubleTapEnabled>
              <Image
                source={`file://${selectedFile}`}
                style={{ width: '100%', height: imageHeight }}
              />
            </Zoomable>
          </GestureHandlerRootView>
        </Modal>
      }
      <ThemedView style={styles.container}>
        {
          files?.map((file: any) => {
            return <React.Fragment key={file.name}>
              {
                file.isFile() ?
                  <ThemedView style={styles.fileContainer}>
                    <ThemedView style={styles.leftContainer}>
                      <TouchableOpacity onPress={() => handleClickImage(file)}>
                        <Image
                          source={`file://${file.path}`}
                          style={{ width: 80, height: 80, borderRadius: 10 }}
                        />
                      </TouchableOpacity>
                      <ThemedView style={{ justifyContent: 'space-between' }}>
                        <ThemedText style={{ fontSize: 16, marginBottom: 10, marginTop: 5 }}>{file.name}</ThemedText>
                        <ThemedText style={{ fontSize: 14, marginBottom: 10, marginTop: 5 }}>{formatFileSize(file.size)}</ThemedText>
                      </ThemedView>
                    </ThemedView>
                  </ThemedView> : null
              }
            </React.Fragment>
          })
        }
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  fileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
    // borderColor: '#ccc',
    // borderWidth: 1,
    padding: 5,
  },
  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 10,
  },
});

export default SearchScreen;
