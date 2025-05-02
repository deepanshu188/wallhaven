import { Modal, StyleSheet, TouchableOpacity } from "react-native";
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

const FiltersModal = ({ clearAndRefetch }: { clearAndRefetch: () => void }) => {
  const { ThemeContext } = Theme;
  const context = useContext(ThemeContext);
  const isDarkMode = context.isDarkMode;
  const [selectedTab, setSelectedTab] = useState('Sorting');

  const { filters, resetFilters, setFilter } = useFilters();

  const [showFilters, setShowFilters] = useState(false);

  const openFilters = () => { setShowFilters(true) };
  const clearFilter = () => { resetFilters() };
  const closeFilters = () => { setShowFilters(false) };

  const handleApplyFilters = () => {
    closeFilters()
    clearAndRefetch();
  };
  return (
    <>
      <ThemedView style={styles.container}>
        <Modal
          visible={showFilters}
          animationType="slide"
          transparent={true}
          hardwareAccelerated={true}
          onRequestClose={closeFilters}
        >
          <ThemedView style={styles.modalBackground}>
            <ThemedView style={styles.filterPanel}>
              <ThemedView style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <ThemedText style={styles.filterTitle}>Filter Options</ThemedText>
                <Ionicons name="close-outline" size={24} color={isDarkMode ? 'white' : 'dark'} onPress={closeFilters} />
              </ThemedView>


              <ThemedView style={{ marginTop: 20 }}>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                  {['Sorting', 'Categories', 'Order', 'Purity'].map((tab) => (
                    <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
                      <ThemedText style={{
                        fontWeight: selectedTab === tab ? 'bold' : 'normal',
                        color: selectedTab === tab ? '#6200ee' : (isDarkMode ? '#aaa' : '#555')
                      }}>
                        {tab}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              </ThemedView>


              <ThemedView style={{ flex: 1, justifyContent: 'space-between', marginTop: 20 }}>
                <ThemedView>
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
                </ThemedView>

                <ThemedView style={{ marginTop: 20 }}>
                  <Button title="Apply" onPress={handleApplyFilters} buttonStyle={{ backgroundColor: '#6200ee' }} />
                  <Button title="Clear" onPress={clearFilter} buttonStyle={{ marginTop: 10, backgroundColor: '#2a2e3600' }} textStyle={{ color: '#6200ee' }} />
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Modal>
      </ThemedView>
      <FAB onPress={openFilters} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  filterPanel: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 500,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    color: '#6200ee',
    fontWeight: 'bold',
  },
});

export default FiltersModal;
