import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";

const Loader = ({ size = 60 }: { size?: number }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      -1,
      false
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800, easing: Easing.ease }),
        withTiming(1, { duration: 800, easing: Easing.ease })
      ),
      -1,
      true
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.4, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedRing1 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedRing2 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-rotation.value * 1.5}deg` }],
    opacity: interpolate(opacity.value, [0.4, 1], [1, 0.4]),
  }));

  const animatedCenter = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scale.value, [1, 1.2], [1.2, 0.8]) }],
  }));

  const primaryColor = "#B1A2FF";

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer Glow Ring */}
      <Animated.View
        style={[
          styles.ring,
          styles.ringOuter,
          { borderColor: primaryColor },
          animatedRing1,
        ]}
      />
      
      {/* Inner Fast Ring */}
      <Animated.View
        style={[
          styles.ring,
          styles.ringInner,
          { borderColor: primaryColor, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
          animatedRing2,
        ]}
      />

      {/* Center Pulse Dot */}
      <Animated.View
        style={[
          styles.centerDot,
          { backgroundColor: primaryColor },
          animatedCenter,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  ring: {
    position: "absolute",
    borderRadius: 100,
    borderWidth: 2,
  },
  ringOuter: {
    width: "100%",
    height: "100%",
    borderStyle: "dashed",
    opacity: 0.6,
  },
  ringInner: {
    width: "70%",
    height: "70%",
    borderWidth: 3,
    borderRadius: 100,
  },
  centerDot: {
    width: "25%",
    height: "25%",
    borderRadius: 100,
    shadowColor: "#B1A2FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default Loader;

