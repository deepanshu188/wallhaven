import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

const FAB = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.fab} 
        onPress={onPress}
        activeOpacity={1}
      >
        <MaterialCommunityIcons name='filter-variant' size={28} color="#B1A2FF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 100,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(25, 25, 25, 0.8)', // Slightly darker for contrast
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(177, 162, 255, 0.3)',
    elevation: 10,
    shadowColor: '#B1A2FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
});

export default FAB;
