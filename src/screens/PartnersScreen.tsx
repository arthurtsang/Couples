import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  Modal,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as NFC from 'expo-nfc';
import { useTheme } from '../ThemeContext';
import { usePartner } from '../PartnerContext';
import {
  Partner,
  Anniversary,
  Preference,
  COMMON_PREFERENCES,
} from '../types';
import React from 'react';

export default function PartnersScreen() {
  const { theme, toggleTheme } = useTheme();
  const { selectedPartner, setSelectedPartner } = usePartner();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({
    firstName: '',
    lastName: '',
    nickName: '',
    intimateName: '',
    preferredName: 'firstName',
    anniversaries: [],
    preferences: [],
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newAnniversaryName, setNewAnniversaryName] = useState('');
  const [newAnniversaryDate, setNewAnniversaryDate] = useState(new Date());
  const [newPreference, setNewPreference] = useState('');
  const [isLike, setIsLike] = useState(true);
  const [nfcConnecting, setNfcConnecting] = useState(false);

  const addPartner = () => {
    const partner: Partner = {
      id: `p${Date.now()}`,
      ...newPartner,
      anniversaries: newPartner.anniversaries || [],
      preferences: newPartner.preferences || [],
    } as Partner;
    setPartners([...partners, partner]);
    setNewPartner({
      firstName: '',
      lastName: '',
      nickName: '',
      intimateName: '',
      preferredName: 'firstName',
      anniversaries: [],
      preferences: [],
      email: '',
      phone: '',
      address: '',
      notes: '',
    });
    setModalVisible(false);
  };

  const addAnniversary = () => {
    const anniversary: Anniversary = { name: newAnniversaryName, date: newAnniversaryDate };
    setNewPartner({
      ...newPartner,
      anniversaries: [...(newPartner.anniversaries || []), anniversary],
    });
    setNewAnniversaryName('');
    setShowDatePicker(false);
  };

  const addPreference = () => {
    const preference: Preference = { name: newPreference, isLike };
    setNewPartner({
      ...newPartner,
      preferences: [...(newPartner.preferences || []), preference],
    });
    setNewPreference('');
  };

  const connectWithNFC = async (partner: Partner) => {
    if (!(await NFC.isAvailableAsync())) {
      Alert.alert('NFC not available on this device');
      return;
    }
    setNfcConnecting(true);
    try {
      await NFC.startReadingAsync();
      const tag = await NFC.readTagAsync();
      const remoteName = tag.data; // Simplified; assumes name is sent
      if (remoteName === partner[selectedPartner?.preferredName || 'firstName']) {
        Alert.alert('Connected!', `Paired with ${remoteName}`);
        setSelectedPartner(partner);
      } else {
        Alert.alert('Mismatch', 'Names do not match');
      }
    } catch (error) {
      Alert.alert('NFC Error', 'Failed to connect');
    } finally {
      setNfcConnecting(false);
      NFC.stopReadingAsync();
    }
  };

  const renderPartner = ({ item }: { item: Partner }) => (
    <TouchableOpacity
      style={[styles.partnerItem, { borderColor: theme.border }]}
      onPress={() => setSelectedPartner(item)}
    >
      <Text style={[styles.partnerText, { color: theme.text }]}>
        {item[item.preferredName]}
      </Text>
      <Button
        title="Invite via Email"
        onPress={() => Linking.openURL(`mailto:${item.email}?subject=Couples Invite`)}
        color={theme.tabBarActive}
      />
      <Button
        title="Invite via SMS"
        onPress={() => Linking.openURL(`sms:${item.phone}&body=Join me on Couples!`)}
        color={theme.tabBarActive}
      />
      <Button
        title="Open Address"
        onPress={() => Linking.openURL(`maps://?q=${encodeURIComponent(item.address)}`)}
        color={theme.tabBarActive}
      />
      <Button
        title="Connect with NFC"
        onPress={() => connectWithNFC(item)}
        color={theme.tabBarActive}
        disabled={nfcConnecting}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.title }]}>Partners</Text>
      <FlatList
        data={partners}
        renderItem={renderPartner}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <Button
        title="Add Partner"
        onPress={() => setModalVisible(true)}
        color={theme.tabBarActive}
      />
      <Button
        title={`Switch to ${theme === LIGHT_THEME ? 'Dark' : 'Light'} Mode`}
        onPress={toggleTheme}
        color={theme.tabBarActive}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={[styles.modal, { backgroundColor: theme.background }]}>
          <Text style={[styles.modalTitle, { color: theme.title }]}>Add Partner</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
            placeholder="First Name"
            placeholderTextColor={theme.text}
            value={newPartner.firstName}
            onChangeText={(text) => setNewPartner({ ...newPartner, firstName: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
            placeholder="Last Name"
            placeholderTextColor={theme.text}
            value={newPartner.lastName}
            onChangeText={(text) => setNewPartner({ ...newPartner, lastName: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
            placeholder="Nick Name"
            placeholderTextColor={theme.text}
            value={newPartner.nickName}
            onChangeText={(text) => setNewPartner({ ...newPartner, nickName: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
            placeholder="Intimate Name"
            placeholderTextColor={theme.text}
            value={newPartner.intimateName}
            onChangeText={(text) => setNewPartner({ ...newPartner, intimateName: text })}
          />
          <Picker
            selectedValue={newPartner.preferredName}
            onValueChange={(value) =>
              setNewPartner({ ...newPartner, preferredName: value as any })
            }
            style={{ color: theme.text }}
          >
            <Picker.Item label="First Name" value="firstName" />
            <Picker.Item label="Last Name" value="lastName" />
            <Picker.Item label="Nick Name" value="nickName" />
            <Picker.Item label="Intimate Name" value="intimateName" />
          </Picker>

          <Text style={[styles.label, { color: theme.text }]}>Anniversaries</Text>
          <FlatList
            data={newPartner.anniversaries}
            renderItem={({ item }) => (
              <Text style={{ color: theme.text }}>{`${item.name}: ${item.date.toDateString()}`}</Text>
            )}
            keyExtractor={(item, index) => `${index}`}
          />
          <Picker
            selectedValue={newAnniversaryName}
            onValueChange={(value) => setNewAnniversaryName(value)}
            style={{ color: theme.text }}
          >
            <Picker.Item label="Select Anniversary" value="" />
            <Picker.Item label="First Met" value="First Met" />
            <Picker.Item label="First Dine Out" value="First Dine Out" />
            <Picker.Item label="First Sex" value="First Sex" />
            <Picker.Item label="Married" value="Married" />
          </Picker>
          <TextInput
            style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
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
          {showDatePicker && (
            <DateTimePicker
              value={newAnniversaryDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setNewAnniversaryDate(date);
              }}
            />
          )}
          <Button title="Add Anniversary" onPress={addAnniversary} color={theme.tabBarActive} />

          <Text style={[styles.label, { color: theme.text }]}>Preferences</Text>
          <FlatList
            data={newPartner.preferences}
            renderItem={({ item }) => (
              <Text style={{ color: theme.text }}>{`${item.name} (${item.isLike ? 'Likes' : 'Hates'})`}</Text>
            )}
            keyExtractor={(item, index) => `${index}`}
          />
          <Picker
            selectedValue={newPreference}
            onValueChange={(value) => setNewPreference(value)}
            style={{ color: theme.text }}
          >
            <Picker.Item label="Select Preference" value="" />
            {COMMON_PREFERENCES.map((pref) => (
              <Picker.Item key={pref} label={pref} value={pref} />
            ))}
          </Picker>
          <TextInput
            style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
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

          <TextInput
            style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
            placeholder="Email"
            placeholderTextColor={theme.text}
            value={newPartner.email}
            onChangeText={(text) => setNewPartner({ ...newPartner, email: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
            placeholder="Phone"
            placeholderTextColor={theme.text}
            value={newPartner.phone}
            onChangeText={(text) => setNewPartner({ ...newPartner, phone: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
            placeholder="Address"
            placeholderTextColor={theme.text}
            value={newPartner.address}
            onChangeText={(text) => setNewPartner({ ...newPartner, address: text })}
          />
          <TextInput
            style={[styles.input, { borderColor: theme.inputBorder, color: theme.text }]}
            placeholder="Notes"
            placeholderTextColor={theme.text}
            value={newPartner.notes}
            onChangeText={(text) => setNewPartner({ ...newPartner, notes: text })}
            multiline
          />
          <Button title="Save" onPress={addPartner} color={theme.tabBarActive} />
          <Button
            title="Cancel"
            onPress={() => setModalVisible(false)}
            color={theme.tabBarActive}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  list: {
    width: '100%',
    paddingHorizontal: 20,
  },
  partnerItem: {
    padding: 10,
    borderWidth: 1,
    marginVertical: 5,
  },
  partnerText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modal: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
});