import { Modal, StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import RadioGroup from "./RadioGroup";
import Button from "./Button";
import { useFilters } from "@/store/filters";
import filterOptions from "@/constants/filterOptions";
import { useContext, useState } from "react";
import Theme from "../contexts/ThemeContexts";
import FAB from "./Fab";
import { useThemeColor } from "@/hooks/useThemeColor";

const FiltersModal = ({ clearAndRefetch }: { clearAndRefetch: () => void }) => {
  const { ThemeContext } = Theme;
  const context = useContext(ThemeContext);
  const isDarkMode = context.isDarkMode;
  const [selectedTab, setSelectedTab] = useState('Sorting');
  
  const primaryPurple = "#B1A2FF";
  const darkBg = "#111113";
  const textSecondary = "#8E8E93";

  const { filters, resetFilters, setFilter, showFilters, setShowFilters } = useFilters();

  const clearFilter = () => { resetFilters() };
  const closeFilters = () => { setShowFilters(false) };

  const handleApplyFilters = () => {
    closeFilters()
    clearAndRefetch();
  };

  const TabButton = ({ title }: { title: string }) => {
    const isActive = selectedTab === title;
    return (
      <TouchableOpacity 
        onPress={() => setSelectedTab(title)}
        style={[
          styles.tabButton,
          isActive && styles.tabButtonActive
        ]}
      >
        <ThemedText style={[
          styles.tabText,
          isActive && styles.tabTextActive
        ]}>
          {title}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={closeFilters}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.filterPanel, { paddingBottom: Math.max(insets.bottom, 20) + 10 }]}>
            {/* Header */}
            <View style={styles.panelHeader}>
              <ThemedText style={styles.panelTitle}>Filters</ThemedText>
              <TouchableOpacity onPress={closeFilters} style={styles.closeIcon}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                {['Sorting', 'Categories', 'Order', 'Purity'].map((tab) => (
                  <TabButton key={tab} title={tab} />
                ))}
              </ScrollView>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedTab === 'Sorting' && (
                  <RadioGroup
                    options={filterOptions.sorting}
                    callBack={(value) => setFilter('sorting', value)}
                    selectedOption={filters?.sorting}
                  />
                )}
                {selectedTab === 'Categories' && (
                  <RadioGroup
                    options={filterOptions.categories}
                    callBack={(value) => setFilter('categories', value)}
                    selectedOption={filters?.categories}
                  />
                )}
                {selectedTab === 'Order' && (
                  <RadioGroup
                    options={filterOptions.order}
                    callBack={(value) => setFilter('order', value)}
                    selectedOption={filters?.order}
                  />
                )}
                {selectedTab === 'Purity' && (
                  <RadioGroup
                    options={filterOptions.purity}
                    callBack={(value) => setFilter('purity', value)}
                    selectedOption={filters?.purity}
                  />
                )}
              </ScrollView>
            </View>

            {/* Footer Actions */}
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={clearFilter}
              >
                <ThemedText style={styles.clearButtonText}>Reset All</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton} 
                onPress={handleApplyFilters}
              >
                <ThemedText style={styles.applyButtonText}>Apply Filters</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  filterPanel: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: 550,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  panelTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  closeIcon: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 8,
    borderRadius: 100,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  tabsScroll: {
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(177, 162, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(177, 162, 255, 0.3)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#B1A2FF',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  applyButton: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(177, 162, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(177, 162, 255, 0.3)',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B1A2FF',
  },
});

export default FiltersModal;
