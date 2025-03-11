import { useState, useEffect } from 'react'; // Added useEffect
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Partner, Anniversary, Preference, COMMON_PREFERENCES } from '../types';
import { useTheme } from '../ThemeContext';
import { lightStyles } from '../theme/light';
import { darkStyles } from '../theme/dark';
import { LIGHT_THEME } from '../theme/light';

interface PartnerModalProps {
  visible: boolean;
  partner: Partial<Partner>;
  isEditing: boolean;
  onSave: (updatedPartner: Partial<Partner>, editPartnerId: string | null) => void;
  onDelete: (editPartnerId: string | null) => void;
  onCancel: () => void;
}

export default function PartnerModal({
  visible,
  partner,
  isEditing,
  onSave,
  onDelete,
  onCancel,
}: PartnerModalProps) {
  const { theme } = useTheme();
  const styles = theme === LIGHT_THEME ? lightStyles : darkStyles;
  const [modalPartner, setModalPartner] = useState<Partial<Partner>>(partner);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newAnniversaryName, setNewAnniversaryName] = useState('');
  const [newAnniversaryDate, setNewAnniversaryDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newPreference, setNewPreference] = useState('');
  const [isLike, setIsLike] = useState(true);

  // Sync modalPartner with partner prop when it changes
  useEffect(() => {
    setModalPartner(partner);
  }, [partner]);

  const addAnniversary = () => {
    const anniversary: Anniversary = { name: newAnniversaryName, date: newAnniversaryDate };
    setModalPartner({
      ...modalPartner,
      anniversaries: [...(modalPartner.anniversaries || []), anniversary],
    });
    setNewAnniversaryName('');
    setSelectedDate(null);
    setShowDatePicker(false);
  };

  const addPreference = () => {
    const preference: Preference = { name: newPreference, isLike };
    setModalPartner({
      ...modalPartner,
      preferences: [...(modalPartner.preferences || []), preference],
    });
    setNewPreference('');
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setModalPartner({ ...modalPartner, phone: formatted });
  };

  const handleSave = () => {
    onSave(modalPartner, isEditing ? modalPartner.id || null : null);
  };

  const handleDelete = () => {
    if (isEditing && modalPartner.id) {
      console.log('Deleting partner with ID:', modalPartner.id);
      onDelete(modalPartner.id);
    } else {
      console.log('No ID to delete or not in edit mode:', { isEditing, id: modalPartner.id });
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{isEditing ? 'Edit Partner' : 'Add Partner'}</Text>

          <Text style={styles.label}>Partner's Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor={theme.text}
            value={modalPartner.firstName}
            onChangeText={(text) => setModalPartner({ ...modalPartner, firstName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor={theme.text}
            value={modalPartner.lastName}
            onChangeText={(text) => setModalPartner({ ...modalPartner, lastName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Nick Name"
            placeholderTextColor={theme.text}
            value={modalPartner.nickName}
            onChangeText={(text) => setModalPartner({ ...modalPartner, nickName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Intimate Name"
            placeholderTextColor={theme.text}
            value={modalPartner.intimateName}
            onChangeText={(text) => setModalPartner({ ...modalPartner, intimateName: text })}
          />
          <Picker
            selectedValue={modalPartner.preferredName}
            onValueChange={(value) =>
              setModalPartner({ ...modalPartner, preferredName: value as any })
            }
            style={styles.picker}
            itemStyle={{ color: theme.pickerText }}
          >
            <Picker.Item label="First Name" value="firstName" />
            <Picker.Item label="Last Name" value="lastName" />
            <Picker.Item label="Nick Name" value="nickName" />
            <Picker.Item label="Intimate Name" value="intimateName" />
          </Picker>

          <Text style={styles.label}>Anniversaries</Text>
          {(modalPartner.anniversaries || []).map((item, index) => (
            <Text key={index} style={{ color: theme.text }}>
              {`${item.name}: ${item.date.toDateString()}`}
            </Text>
          ))}
          <Picker
            selectedValue={newAnniversaryName}
            onValueChange={(value) => setNewAnniversaryName(value)}
            style={styles.picker}
            itemStyle={{ color: theme.pickerText }}
          >
            <Picker.Item label="Select Anniversary" value="" />
            <Picker.Item label="First Met" value="First Met" />
            <Picker.Item label="First Dine Out" value="First Dine Out" />
            <Picker.Item label="First Sex" value="First Sex" />
            <Picker.Item label="Married" value="Married" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Custom Anniversary Name"
            placeholderTextColor={theme.text}
            value={newAnniversaryName}
            onChangeText={setNewAnniversaryName}
          />
          <Button
            title="Pick Date"
            onPress={() => setShowDatePicker(true)}
            color={theme.tabBarActive}
          />
          {selectedDate && (
            <Text style={{ color: theme.text, marginVertical: 5 }}>
              Selected: {selectedDate.toDateString()}
            </Text>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={newAnniversaryDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setNewAnniversaryDate(date);
                  setSelectedDate(date);
                }
              }}
              textColor={theme.datePickerText}
            />
          )}
          <Button title="Add Anniversary" onPress={addAnniversary} color={theme.tabBarActive} />

          <Text style={styles.label}>Preferences</Text>
          {(modalPartner.preferences || []).map((item, index) => (
            <Text key={index} style={{ color: theme.text }}>
              {`${item.name} (${item.isLike ? 'Likes' : 'Hates'})`}
            </Text>
          ))}
          <Picker
            selectedValue={newPreference}
            onValueChange={(value) => setNewPreference(value)}
            style={styles.picker}
            itemStyle={{ color: theme.pickerText }}
          >
            <Picker.Item label="Select Preference" value="" />
            {COMMON_PREFERENCES.map((pref) => (
              <Picker.Item key={pref} label={pref} value={pref} />
            ))}
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Custom Preference"
            placeholderTextColor={theme.text}
            value={newPreference}
            onChangeText={setNewPreference}
          />
          <Button
            title={isLike ? 'Likes' : 'Hates'}
            onPress={() => setIsLike(!isLike)}
            color={theme.tabBarActive}
          />
          <Button title="Add Preference" onPress={addPreference} color={theme.tabBarActive} />

          <Text style={styles.label}>Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="email"
            placeholderTextColor={theme.text}
            value={modalPartner.email}
            onChangeText={(text) => setModalPartner({ ...modalPartner, email: text })}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="phone"
            placeholderTextColor={theme.text}
            value={modalPartner.phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={12}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor={theme.text}
            value={modalPartner.address}
            onChangeText={(text) => setModalPartner({ ...modalPartner, address: text })}
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.input}
            placeholder="Notes"
            placeholderTextColor={theme.text}
            value={modalPartner.notes}
            onChangeText={(text) => setModalPartner({ ...modalPartner, notes: text })}
            multiline
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Button title="Save" onPress={handleSave} color={theme.tabBarActive} />
            {isEditing && (
              <Button title="Delete" onPress={handleDelete} color="#ff4444" />
            )}
            <Button title="Cancel" onPress={onCancel} color={theme.tabBarActive} />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}