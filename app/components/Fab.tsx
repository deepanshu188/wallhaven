import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

const FAB = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={[styles.container]}>
      <TouchableOpacity style={styles.fab} onPress={onPress}>
        <Feather name='filter' size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100,
  },
  fab: {
    backgroundColor: '#8B0EFC',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FAB;
