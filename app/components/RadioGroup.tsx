import { TouchableOpacity, StyleSheet } from "react-native";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

interface RadioGroupProps {
  options?: { label: string; value: string; disabled?: boolean }[];
  callBack?: (selected: string) => void;
  selectedOption?: string;
  variant?: "outlined" | "filled";
}

const RadioGroup = ({
  options = [],
  callBack,
  selectedOption,
  variant,
}: RadioGroupProps) => {
  const primaryPurple = "#B1A2FF";
  
  return (
    <ThemedView style={styles.container}>
      {options.map(({ label, value, disabled }) => {
        const isSelected = selectedOption === value;
        return (
          <TouchableOpacity
            key={value}
            style={styles.radioContainer}
            disabled={disabled}
            onPress={() => callBack?.(value)}
          >
            {variant !== "outlined" && (
              <ThemedView
                style={[
                  styles.outerCircle,
                  { borderColor: isSelected ? primaryPurple : "rgba(255,255,255,0.2)" }
                ]}
              >
                {isSelected && (
                  <ThemedView
                    style={[
                      styles.innerCircle,
                      { backgroundColor: primaryPurple },
                    ]}
                  />
                )}
              </ThemedView>
            )}
            <ThemedView
              style={
                variant === "outlined"
                  ? {
                      borderColor: isSelected ? primaryPurple : "rgba(255,255,255,0.1)",
                      borderWidth: 2,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      minWidth: 80,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isSelected ? "rgba(177, 162, 255, 0.1)" : "transparent",
                    }
                  : {}
              }
            >
              <ThemedText
                style={[
                  styles.label,
                  isSelected && { color: primaryPurple, fontWeight: "600" }
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {label}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  radioContainer: {
    width: "33.33%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  outerCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
  },
});

export default RadioGroup;
