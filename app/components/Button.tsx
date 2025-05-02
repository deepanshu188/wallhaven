import { StyleSheet, TouchableOpacity } from "react-native";
import ThemedText from "./ThemedText";
import { useContext } from "react";
import Theme from "../contexts/ThemeContexts";

interface ButtonProps {
  title: string;
  buttonStyle?: any;
  textStyle?: any;
  disabled?: boolean;
  onPress: () => void;
}

const Button = ({ title, onPress, buttonStyle, textStyle, disabled }: ButtonProps) => {
  const { isDarkMode } = useContext(Theme.ThemeContext);
  return (
    <>
      <TouchableOpacity style={[styles.button, buttonStyle, disabled && [styles.disabled, isDarkMode ? styles.disabledDark : styles.disabledLight]]} onPress={onPress} disabled={disabled}>
        <ThemedText lightColor="#fff" style={[styles.text, textStyle]}>{title}</ThemedText>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledDark: {
    backgroundColor: '#3e3e3e',
  },
  disabledLight: {
    backgroundColor: '#393939',
  },
  text: {
    fontSize: 16,
  },
});

export default Button;
