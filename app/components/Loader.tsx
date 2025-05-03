import { useThemeColor } from "@/hooks/useThemeColor"
import { ActivityIndicator } from "react-native"

const Loader = () => {
  const primaryColor = useThemeColor({}, 'primaryColor')
  return (
    <ActivityIndicator size="large" color={primaryColor} />
  )
}

export default Loader;
