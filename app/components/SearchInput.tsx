import React, { useCallback, useRef, useState } from "react";
import { TextInput, View, StyleSheet, Pressable } from "react-native";
import { useFilters } from "@/store/filters";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

const SearchInput = () => {
  const { setFilter, filters, setShowFilters } = useFilters();
  const [text, setText] = useState(filters.q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  const handleChange = (text: string) => {
    setText(text);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setFilter("q", text);
      if (text.length === 0) {
        inputRef.current?.blur();
      }
    }, 1000);
  };

  React.useEffect(() => {
    setText(filters.q);
  }, [filters.q]);

  const clearText = () => {
    setText("");
    setFilter("q", "");
    inputRef.current?.blur();
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={24} color="#8E8E93" />
      <TextInput
        style={styles.input}
        placeholder="Search wallpapers..."
        placeholderTextColor="#8E8E93"
        onChangeText={handleChange}
        value={text}
        ref={inputRef}
      />
      <View style={styles.rightActions}>
        {filters.q ? (
          <Pressable onPress={clearText} style={styles.actionButton}>
            <Feather name="x" size={18} color="#B1A2FF" />
          </Pressable>
        ) : null}
        <Pressable 
          onPress={() => setShowFilters(true)} 
          style={[styles.actionButton, { marginLeft: 8 }]}
        >
          <MaterialIcons name="tune" size={20} color="#B1A2FF" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E", // Dark gray background
    paddingHorizontal: 15,
    marginTop: 0,
    marginBottom: 12,
    borderRadius: 25, // Pill shape
    height: 50,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'rgba(177, 162, 255, 0.15)',
    padding: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(177, 162, 255, 0.2)',
  },
});

export default SearchInput;
