import { useContext } from "react";
import Theme from "@/app/contexts/ThemeContexts";
import { StyleSheet, TextInput } from "react-native";

interface InputProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
}

const Input = ({ placeholder, value, onChangeText }: InputProps) => {
  const context = useContext(Theme.ThemeContext);
  const isDarkMode = context.isDarkMode;
  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: isDarkMode ? "#3e3e3e" : "#f4f3f4",
          color: isDarkMode ? "#fff" : "#000",
        },
      ]}
      placeholder={placeholder}
      placeholderTextColor={isDarkMode ? "#fff" : "#000"}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
    color: "black",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default Input;
