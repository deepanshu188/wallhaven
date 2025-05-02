import Theme from '@/app/contexts/ThemeContexts';
import { Colors } from '@/constants/Colors';
import { useContext } from 'react';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const context = useContext(Theme.ThemeContext)
  const theme = context.isDarkMode ? 'dark' : 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
