import React, { useRef, useState } from 'react';
import { TextInput, View, StyleSheet, Pressable } from 'react-native';
import { useFilters } from '@/store/filters';
import { useContext } from 'react';
import Theme from '../contexts/ThemeContexts';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const SearchInput = () => {
  const { setFilter, filters } = useFilters();
  const { theme } = useContext(Theme.ThemeContext);
  const [text, setText] = useState(filters.q || '');
  const debounceRef = useRef<number | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  const handleChange = (text: string) => {
    setText(text);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setFilter('q', text);
      if (text.length === 0) {
        inputRef.current?.blur();
      }
    }, 500);
  };

  const clearText = () => {
    setText('');
    setFilter('q', '');
    inputRef.current?.blur();
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.background,
      paddingHorizontal: 10,
      marginVertical: 5,
      borderRadius: 5,
      borderColor: '#302f2f',
      borderWidth: 1,
    },
    input: {
      color: theme.text,
      fontSize: 16,
      width: '90%',
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor={theme.text}
        onChangeText={handleChange}
        value={text}
        ref={inputRef}
      />
      {
        filters.q ?
          <Pressable onPress={clearText}>
            <Entypo name="cross" size={24} color={theme.text} />
          </Pressable>
          :
          <MaterialIcons name="search" size={24} color={theme.text} />
      }
    </View>
  );
};

export default SearchInput;
