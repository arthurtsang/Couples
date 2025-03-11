import { useState, useEffect } from 'react';
import {
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import NfcManager, { NfcTech, NfcEvents } from 'react-native-nfc-manager';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../ThemeContext';
import { usePartner } from '../PartnerContext';
import { Partner, Anniversary } from '../types';
import { lightStyles } from '../theme/light';
import { darkStyles } from '../theme/dark';
import { LIGHT_THEME } from '../theme/light';
import PartnerModal from './PartnerModal';
import { useNavigation } from '@react-navigation/native';

const PARTNERS_KEY = 'partnersData';

export default function PartnersScreen() {
  const { theme, toggleTheme } = useTheme();
  const styles = theme === LIGHT_THEME ? lightStyles : darkStyles;
  const { setSelectedPartner } = usePartner();
  const navigation = useNavigation();
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
  const [isEditing, setIsEditing] = useState(false);
  const [editPartnerId, setEditPartnerId] = useState<string | null>(null);
  const [nfcConnecting, setNfcConnecting] = useState(false);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const storedPartners = await SecureStore.getItemAsync(PARTNERS_KEY);
        if (storedPartners) {
          const parsedPartners = JSON.parse(storedPartners);
          const partnersWithDates = parsedPartners.map((p: Partner) => ({
            ...p,
            anniversaries: p.anniversaries.map((a: Anniversary) => ({
              ...a,
              date: new Date(a.date),
            })),
          }));
          setPartners(partnersWithDates);
        }
      } catch (error) {
        console.error('Failed to load partners:', error);
      }
    };
    loadPartners();
    NfcManager.start();
  }, []);

  useEffect(() => {
    const savePartners = async () => {
      try {
        await SecureStore.setItemAsync(PARTNERS_KEY, JSON.stringify(partners));
      } catch (error) {
        console.error('Failed to save partners:', error);
      }
    };
    if (partners.length > 0) savePartners();
  }, [partners]);

  const addOrUpdatePartner = (updatedPartner: Partial<Partner>, editPartnerId: string | null) => {
    if (isEditing && editPartnerId) {
      const updatedPartners = partners.map((p) =>
        p.id === editPartnerId ? { ...p, ...updatedPartner, id: editPartnerId } as Partner : p
      );
      setPartners(updatedPartners);
    } else {
      const partner: Partner = {
        id: `p${Date.now()}`,
        ...updatedPartner,
        anniversaries: updatedPartner.anniversaries || [],
        preferences: updatedPartner.preferences || [],
      } as Partner;
      setPartners([...partners, partner]);
    }
    resetModal();
  };

  const deletePartner = (editPartnerId: string | null) => {
    console.log('deletePartner called with ID:', editPartnerId); // Debug log
    if (editPartnerId) {
      const updatedPartners = partners.filter((p) => p.id !== editPartnerId);
      console.log('Updated partners after delete:', updatedPartners); // Debug log
      setPartners(updatedPartners);
      resetModal();
    }
  };

  const resetModal = () => {
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
    setIsEditing(false);
    setEditPartnerId(null);
    setModalVisible(false);
  };

  const editPartner = (partner: Partner) => {
    console.log('Editing partner with ID:', partner.id); // Debug log
    setNewPartner(partner);
    setIsEditing(true);
    setEditPartnerId(partner.id);
    setModalVisible(true);
  };

  const connectWithNFC = async (partner: Partner) => {
    try {
      setNfcConnecting(true);
      const isSupported = await NfcManager.isSupported();
      if (!isSupported) {
        Alert.alert('NFC Not Supported', 'This device does not support NFC.');
        return;
      }

      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        Alert.alert('NFC Disabled', 'Please enable NFC in your device settings.');
        return;
      }

      await NfcManager.requestTechnology(NfcTech.NfcA);
      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
        const remoteName = tag.id;
        const localName = partner[selectedPartner?.preferredName || 'firstName'];
        if (remoteName === localName) {
          Alert.alert('Connected!', `Paired with ${remoteName}`);
          setSelectedPartner(partner);
        } else {
          Alert.alert('Mismatch', 'Names do not match');
        }
        NfcManager.unregisterTagEvent();
      });

      Alert.alert('NFC Ready', 'Tap another device to pair.');
    } catch (error) {
      const err = error as Error;
      Alert.alert('NFC Error', `Failed to connect: ${err.message}`);
    } finally {
      setNfcConnecting(false);
      await NfcManager.cancelTechnologyRequest();
    }
  };

  const getUpcomingAnniversary = (anniversaries: Anniversary[]) => {
    const now = new Date();
    const upcoming = anniversaries
      .map((a) => {
        const thisYear = new Date(now.getFullYear(), a.date.getMonth(), a.date.getDate());
        const nextYear = new Date(now.getFullYear() + 1, a.date.getMonth(), a.date.getDate());
        const targetDate = thisYear > now ? thisYear : nextYear;
        return { ...a, targetDate };
      })
      .filter((a) => a.targetDate >= now)
      .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime())[0];
    return upcoming ? `${upcoming.name}: ${upcoming.targetDate.toDateString()}` : 'None';
  };

  const renderPartner = ({ item }: { item: Partner }) => (
    <TouchableOpacity
      style={styles.partnerItem}
      onPress={() => {
        setSelectedPartner(item);
        navigation.navigate('My Ideas');
      }}
      onLongPress={() => editPartner(item)}
    >
      <Text style={styles.partnerText}>{item[item.preferredName]}</Text>
      <Text style={{ color: theme.text, fontSize: 14 }}>
        Upcoming: {getUpcomingAnniversary(item.anniversaries)}
      </Text>
      <Button
        title="Open Address"
        onPress={() => Linking.openURL(`maps://?q=${encodeURIComponent(item.address || '')}`)}
        color={theme.tabBarActive}
      />
      {item.phone && (
        <Button
          title="Call Phone"
          onPress={() => Linking.openURL(`tel:${item.phone}`)}
          color={theme.tabBarActive}
        />
      )}
      {item.email && (
        <Button
          title="Invite via Email"
          onPress={() => Linking.openURL(`mailto:${item.email}?subject=Couples Invite`)}
          color={theme.tabBarActive}
        />
      )}
      {item.phone && (
        <Button
          title="Invite via SMS"
          onPress={() => Linking.openURL(`sms:${item.phone}&body=Join me on Couples!`)}
          color={theme.tabBarActive}
        />
      )}
      <Button
        title="Connect with NFC"
        onPress={() => connectWithNFC(item)}
        color={theme.tabBarActive}
        disabled={nfcConnecting}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Partners</Text>
      <FlatList
        data={partners}
        renderItem={renderPartner}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <Button
        title="Add Partner"
        onPress={() => {
          setIsEditing(false);
          setEditPartnerId(null);
          setModalVisible(true);
        }}
        color={theme.tabBarActive}
      />
      <Button
        title={`Switch to ${theme === LIGHT_THEME ? 'Dark' : 'Light'} Mode`}
        onPress={toggleTheme}
        color={theme.tabBarActive}
      />
      <PartnerModal
        visible={modalVisible}
        partner={newPartner}
        isEditing={isEditing}
        onSave={addOrUpdatePartner}
        onDelete={deletePartner}
        onCancel={resetModal}
      />
    </View>
  );
}