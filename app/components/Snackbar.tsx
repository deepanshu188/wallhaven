import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";

const Snackbar = ({ message, visible, onDismiss, duration = 3000 }: any) => {
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        hideSnackbar();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideSnackbar = () => {
    Animated.timing(slideAnim, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss && onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={hideSnackbar}>
        <Text style={styles.dismiss}>Dismiss</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#323232",
    borderRadius: 6,
    padding: 16,
    zIndex: 1000,
    elevation: 5,
  },
  message: {
    color: "white",
    maxWidth: 280,
  },
  dismiss: {
    color: "#00ff89",
    fontWeight: "bold",
  },
});

export default Snackbar;
