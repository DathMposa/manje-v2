import React from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ManjeText } from './ManjeText';

export interface CountryCode {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

export const countryCodes: CountryCode[] = [
  { code: 'MW', dialCode: '+265', name: 'Malawi', flag: '🇲🇼' },
  { code: 'ZA', dialCode: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: 'ZM', dialCode: '+260', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', dialCode: '+263', name: 'Zimbabwe', flag: '🇿🇼' },
  { code: 'TZ', dialCode: '+255', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'KE', dialCode: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: 'UG', dialCode: '+256', name: 'Uganda', flag: '🇺🇬' },
  { code: 'RW', dialCode: '+250', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'BI', dialCode: '+257', name: 'Burundi', flag: '🇧🇮' },
  { code: 'CD', dialCode: '+243', name: 'DR Congo', flag: '🇨🇩' },
  { code: 'MZ', dialCode: '+258', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'BW', dialCode: '+267', name: 'Botswana', flag: '🇧🇼' },
  { code: 'NA', dialCode: '+264', name: 'Namibia', flag: '🇳🇦' },
  { code: 'AO', dialCode: '+244', name: 'Angola', flag: '🇦🇴' },
  { code: 'NG', dialCode: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'GH', dialCode: '+233', name: 'Ghana', flag: '🇬🇭' },
  { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', dialCode: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', dialCode: '+61', name: 'Australia', flag: '🇦🇺' },
];

export const defaultCountryCode: CountryCode = countryCodes[0]; // Malawi

interface CountryCodePickerProps {
  selectedCountry: CountryCode;
  onSelect: (country: CountryCode) => void;
  colors: {
    bg: {
      base: string;
      subtle: string;
    };
    text: {
      primary: string;
      secondary: string;
      inverse: string;
    };
    border: {
      light: string;
      medium: string;
    };
    primary: {
      default: string;
    };
  };
}

export function CountryCodePicker({
  selectedCountry,
  onSelect,
  colors,
}: CountryCodePickerProps) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCountries = React.useMemo(() => {
    if (!searchQuery.trim()) return countryCodes;
    const query = searchQuery.toLowerCase();
    return countryCodes.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.dialCode.includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelect = (country: CountryCode) => {
    onSelect(country);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.pickerButton, { borderColor: colors.border.light }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <ManjeText variant="body.md" style={styles.flag}>{selectedCountry.flag}</ManjeText>
        <ManjeText variant="label.md" style={[{ color: colors.text.primary, fontWeight: '500' }]}>
          {selectedCountry.dialCode}
        </ManjeText>
        <Feather name="chevron-down" size={16} color={colors.text.secondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <Animated.View
            entering={FadeIn}
            style={[styles.modalContent, { backgroundColor: colors.bg.base }]}
          >
            <View style={styles.modalHeader}>
              <ManjeText variant="headline.sm" style={[{ color: colors.text.primary }]}>
                Select Country
              </ManjeText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.searchContainer,
                { backgroundColor: colors.bg.subtle, borderColor: colors.border.light },
              ]}
            >
              <Feather name="search" size={18} color={colors.text.secondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text.primary }]}
                placeholder="Search country..."
                placeholderTextColor={colors.text.secondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Feather name="x" size={18} color={colors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.countryItem,
                    { borderBottomColor: colors.border.light },
                    selectedCountry.code === item.code &&
                      styles.selectedItem,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <ManjeText variant="body.lg" style={styles.countryFlag}>{item.flag}</ManjeText>
                  <View style={styles.countryInfo}>
                    <ManjeText variant="body.md" style={[{ color: colors.text.primary, fontWeight: '500' }]}>
                      {item.name}
                    </ManjeText>
                    <ManjeText variant="body.sm" style={[{ color: colors.text.secondary, marginTop: 2 }]}>
                      {item.dialCode}
                    </ManjeText>
                  </View>
                  {selectedCountry.code === item.code && (
                    <Feather name="check" size={20} color={colors.primary.default} />
                  )}
                </Pressable>
              )}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginRight: 8,
    minWidth: 90,
  },
  flag: {
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  selectedItem: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  countryFlag: {
    marginRight: 12,
    width: 30,
  },
  countryInfo: {
    flex: 1,
  },
});
