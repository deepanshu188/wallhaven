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
  const primaryColor = useThemeColor({}, "primaryColor");
  const secondaryColor = useThemeColor({}, "secondaryColor");
  return (
    <ThemedView style={styles.container}>
      {options.map(({ label, value, disabled }) => (
        <TouchableOpacity
          key={value}
          style={styles.radioContainer}
          disabled={disabled}
          onPress={() => callBack?.(value)}
        >
          {variant !== "outlined" && (
            <ThemedView
              style={[
                { borderColor: disabled ? "grey" : primaryColor },
                styles.outerCircle,
              ]}
            >
              {selectedOption === value && (
                <ThemedView
                  style={[
                    styles.innerCircle,
                    { backgroundColor: secondaryColor },
                  ]}
                />
              )}
            </ThemedView>
          )}
          <ThemedView
            style={
              variant === "outlined"
                ? {
                    borderColor:
                      selectedOption === value ? primaryColor : "#ccc",
                    borderWidth: 2,
                    padding: 5,
                    minWidth: 80,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : {}
            }
          >
            <ThemedText
              style={styles.label}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {label}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>
      ))}
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
