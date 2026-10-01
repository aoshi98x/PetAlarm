import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useData } from '@/data/DataContext';
import type { Caregiver } from '@/data/types';

// Helper to calculate exact age from a Date object
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

// Format Date as DD / MM / AAAA
function formatDateDisplay(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day} / ${month} / ${year}`;
}

// Parse DD / MM / AAAA or ISO into Date
function parseInitialDate(dateStr?: string): Date {
  if (!dateStr) return new Date(2000, 0, 1);
  const parts = dateStr.split('/').map((s) => s.trim());
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const parsed = new Date(year, month, day);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  const isoParsed = new Date(dateStr);
  if (!isNaN(isoParsed.getTime())) return isoParsed;
  return new Date(2000, 0, 1);
}

const PET_OPTIONS = [
  ...Array.from({ length: 20 }, (_, i) => String(i + 1)),
  'Otro',
];

interface AddressSuggestion {
  place_id: number;
  display_name: string;
}

export default function CaregiverScreen() {
  const { data, saveCaregiver } = useData();
  const initial = data.caregiver;

  // Form State
  const [name, setName] = useState(initial?.name ?? '');
  const [photoUri, setPhotoUri] = useState(initial?.photoUri ?? '');

  // 1. Cantidad de peluditos State
  const initialPets = initial?.numberOfPets ?? '1';
  const isInitialInPreset = Array.from({ length: 20 }, (_, i) => String(i + 1)).includes(initialPets);
  const [selectedPetOption, setSelectedPetOption] = useState<string>(
    initialPets ? (isInitialInPreset ? initialPets : 'Otro') : '1'
  );
  const [customPetsCount, setCustomPetsCount] = useState<string>(
    isInitialInPreset ? '' : (initialPets ?? '')
  );
  const [showPetsModal, setShowPetsModal] = useState(false);

  // 2. Fecha de Nacimiento State (Default: 1 de Enero de 2000)
  const [birthDateObj, setBirthDateObj] = useState<Date>(() =>
    parseInitialDate(initial?.birthDate)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 3. Dirección de residencia & Mapas State
  const [address, setAddress] = useState(initial?.address ?? '');
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const calculatedAge = calculateAge(birthDateObj);

  // Handle Photo Picker
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // Handle Date Change
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      setBirthDateObj(selectedDate);
    }
  };

  // Real-time Address autocomplete search (Nominatim)
  const handleAddressTextChange = (text: string) => {
    setAddress(text);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (text.trim().length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSearchingAddress(true);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          text.trim()
        )}&addressdetails=1&limit=5`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'PetAlarmApp/1.0',
          },
        });
        const json = await res.json();
        if (Array.isArray(json)) {
          setAddressSuggestions(json);
          setShowSuggestions(json.length > 0);
        }
      } catch {
        // Fallback silently if offline or rate limited
      } finally {
        setIsSearchingAddress(false);
      }
    }, 450);
  };

  // Open native maps app with query
  const handleOpenNativeMaps = () => {
    const query = address.trim() || 'Veterinarias';
    const encoded = encodeURIComponent(query);
    const url = Platform.select({
      ios: `maps:0,0?q=${encoded}`,
      android: `geo:0,0?q=${encoded}`,
    });

    Linking.openURL(url || `https://www.google.com/maps/search/?api=1&query=${encoded}`).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
    });
  };

  const handleSelectSuggestion = (item: AddressSuggestion) => {
    setAddress(item.display_name);
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      setErrors({ name: 'El nombre es obligatorio' });
      return;
    }

    // Determine final number of pets
    const finalNumberOfPets =
      selectedPetOption === 'Otro' ? customPetsCount.trim() || '1' : selectedPetOption;

    const caregiver: Caregiver = {
      name: name.trim(),
      age: String(calculatedAge), // Age stored as number string
      numberOfPets: finalNumberOfPets,
      birthDate: formatDateDisplay(birthDateObj),
      address: address.trim(),
      photoUri,
    };

    saveCaregiver(caregiver);

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              accessibilityLabel="Volver"
              activeOpacity={0.7}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sobre ti</Text>
          </View>

          {/* Photo Picker */}
          <View style={styles.photoSection}>
            <Pressable
              onPress={handlePickImage}
              style={styles.avatarCircle}
              accessibilityLabel="Seleccionar foto">
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <MaterialCommunityIcons name="tray-arrow-up" size={44} color="#8E959E" />
              )}
              <View style={styles.plusBadge}>
                <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
              </View>
            </Pressable>

            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.addPhotoTouch}
              activeOpacity={0.7}>
              <Text style={styles.addPhotoText}>
                {photoUri ? 'Cambiar Foto' : 'Agregar Foto'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            {/* Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                placeholder="Ej. Lorena"
                placeholderTextColor="#A0AEC0"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            {/* 1. Cantidad de peluditos (Dropdown 1-20 y Otro) */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cantidad de peluditos</Text>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => setShowPetsModal(true)}
                activeOpacity={0.8}>
                <Text style={styles.dropdownSelectorText}>
                  {selectedPetOption === 'Otro'
                    ? customPetsCount
                      ? `${customPetsCount} peludito(s) (Personalizado)`
                      : 'Otro (indica la cantidad)'
                    : `${selectedPetOption} ${selectedPetOption === '1' ? 'peludito' : 'peluditos'}`}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#6B7280" />
              </TouchableOpacity>

              {/* Extra input when 'Otro' is selected */}
              {selectedPetOption === 'Otro' && (
                <TextInput
                  style={[styles.input, { marginTop: 6 }]}
                  placeholder="Escribe la cantidad (ej. 25)"
                  placeholderTextColor="#A0AEC0"
                  value={customPetsCount}
                  keyboardType="numeric"
                  onChangeText={setCustomPetsCount}
                  autoFocus
                />
              )}
            </View>

            {/* 2. Fecha de Nacimiento (Picker con 1 de Enero de 2000 por defecto y cálculo de edad) */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithBadge}>
                <Text style={styles.inputLabel}>Fecha de Nacimiento</Text>
                <View style={styles.ageBadge}>
                  <Text style={styles.ageBadgeText}>{calculatedAge} años</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.dateSelector}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}>
                <Text style={styles.dateSelectorText}>
                  {formatDateDisplay(birthDateObj)}
                </Text>
                <MaterialCommunityIcons name="calendar-outline" size={22} color="#56936E" />
              </TouchableOpacity>

              {showDatePicker && (
                <View style={Platform.OS === 'ios' ? styles.iosPickerContainer : undefined}>
                  <DateTimePicker
                    value={birthDateObj}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    maximumDate={new Date()}
                    onChange={handleDateChange}
                  />
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity
                      style={styles.iosPickerDoneButton}
                      onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.iosPickerDoneText}>Listo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            {/* 3. Dirección de residencia (Con sugerencias y mapas nativos) */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithBadge}>
                <Text style={styles.inputLabel}>Dirección de residencia</Text>
                <TouchableOpacity
                  style={styles.mapsButton}
                  onPress={handleOpenNativeMaps}
                  activeOpacity={0.7}>
                  <MaterialCommunityIcons name="map-marker-radius" size={16} color="#56936E" />
                  <Text style={styles.mapsButtonText}>Abrir Mapas</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.addressInputWrapper}>
                <TextInput
                  style={[styles.input, { paddingRight: 40 }]}
                  placeholder="Ej. Calle 1 # 63-06 Bogotá D.C."
                  placeholderTextColor="#A0AEC0"
                  value={address}
                  onChangeText={handleAddressTextChange}
                />
                {isSearchingAddress ? (
                  <ActivityIndicator
                    size="small"
                    color="#56936E"
                    style={styles.addressLoadingIcon}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.addressLoadingIcon}
                    onPress={handleOpenNativeMaps}>
                    <MaterialCommunityIcons name="map-marker-outline" size={22} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Suggestions Dropdown */}
              {showSuggestions && addressSuggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {addressSuggestions.map((item) => (
                    <TouchableOpacity
                      key={item.place_id}
                      style={styles.suggestionItem}
                      onPress={() => handleSelectSuggestion(item)}>
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={18}
                        color="#56936E"
                        style={{ marginRight: 8, marginTop: 2 }}
                      />
                      <Text style={styles.suggestionText} numberOfLines={2}>
                        {item.display_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.footerSection}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSave}
              activeOpacity={0.85}>
              <Text style={styles.submitButtonText}>Guardar Información</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Dropdown para Cantidad de Peluditos */}
      <Modal
        visible={showPetsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPetsModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowPetsModal(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cantidad de peluditos</Text>
              <TouchableOpacity onPress={() => setShowPetsModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={PET_OPTIONS}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = selectedPetOption === item;
                return (
                  <TouchableOpacity
                    style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                    onPress={() => {
                      setSelectedPetOption(item);
                      setShowPetsModal(false);
                    }}>
                    <Text
                      style={[
                        styles.modalItemText,
                        isSelected && styles.modalItemTextSelected,
                      ]}>
                      {item === 'Otro' ? 'Otro (Personalizado...)' : `${item} ${item === '1' ? 'peludito' : 'peluditos'}`}
                    </Text>
                    {isSelected && (
                      <MaterialCommunityIcons name="check" size={20} color="#56936E" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  /* Avatar / Photo */
  photoSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  avatarCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E7EAE6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  plusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#52946B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FAF9F6',
  },
  addPhotoTouch: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  addPhotoText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#52946B',
  },
  /* Form */
  formSection: {
    marginTop: 12,
    gap: 18,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
  },
  labelWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ageBadge: {
    backgroundColor: '#E8F5EC',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ageBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#56936E',
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5EC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mapsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#56936E',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 4,
  },
  /* Dropdown Selector */
  dropdownSelector: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownSelectorText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  /* Date Selector */
  dateSelector: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  dateSelectorText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  iosPickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
    padding: 10,
    alignItems: 'center',
  },
  iosPickerDoneButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  iosPickerDoneText: {
    color: '#56936E',
    fontWeight: '700',
    fontSize: 15,
  },
  /* Address & Suggestions */
  addressInputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  addressLoadingIcon: {
    position: 'absolute',
    right: 14,
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 6,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 18,
  },
  /* Footer / Button */
  footerSection: {
    marginTop: 40,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#56936E',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#56936E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: '65%',
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  modalItemSelected: {
    backgroundColor: '#E8F5EC',
  },
  modalItemText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  modalItemTextSelected: {
    color: '#56936E',
    fontWeight: '700',
  },
});
