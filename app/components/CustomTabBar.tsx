import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: Platform.OS === 'ios' ? insets.bottom : 20 }]}>
      <View style={styles.container}>
        <View style={styles.tabBar}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            const getIcon = () => {
              // Active icon is white, inactive is grey
              const color = isFocused ? '#FFFFFF' : '#8E8E93';
              const size = 26;

              switch (route.name) {
                case 'index':
                  return <Ionicons name={isFocused ? "home" : "home-outline"} size={size} color={color} />;
                case 'collections':
                  return <MaterialIcons name={isFocused ? "favorite" : "favorite-border"} size={size} color={color} style={{ marginTop: 2 }} />;
                case 'downloads':
                  return <Ionicons name={isFocused ? "download" : "download-outline"} size={size} color={color} />;
                case 'settings':
                  return <Ionicons name={isFocused ? "person" : "person-outline"} size={size} color={color} />;
                default:
                  return <Ionicons name="help-outline" size={size} color={color} />;
              }
            };

            if (options.href === null) return null;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.iconContainer,
                  isFocused && styles.activeIconContainer
                ]}>
                  {getIcon()}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: width * 0.9,
    alignSelf: 'center',
    borderRadius: 100,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  container: {
    height: 70,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(25, 25, 25, 0.95)',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(177, 162, 255, 0.15)',
    borderRadius: 100,
    shadowColor: '#B1A2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 3,
  },
});
