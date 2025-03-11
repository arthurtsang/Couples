import { StyleSheet } from 'react-native';

export const LIGHT_THEME = {
  background: '#fff',
  text: '#6b4e5f',
  title: '#4a2c3d',
  border: '#f5e6f0',
  tabBarBackground: '#f5e6f0',
  tabBarActive: '#4a2c3d',
  inputBorder: '#4a2c3d',
  buttonText: '#fff',
  pickerText: '#6b4e5f',
  pickerBackground: '#fff',
  datePickerText: '#4a2c3d',
  modalBackground: '#fff',
  label: '#4a2c3d',
};

export const lightStyles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: LIGHT_THEME.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LIGHT_THEME.title,
    marginVertical: 20,
  },
  list: {
    width: '100%',
    paddingHorizontal: 20,
  },
  partnerItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: LIGHT_THEME.border,
    marginVertical: 5,
  },
  partnerText: {
    fontSize: 16,
    color: LIGHT_THEME.text,
    marginBottom: 10,
  },
  modal: {
    flex: 1,
    padding: 20,
    backgroundColor: LIGHT_THEME.modalBackground,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: LIGHT_THEME.title,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: LIGHT_THEME.inputBorder,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
    color: LIGHT_THEME.text,
  },
  label: {
    fontSize: 16,
    color: LIGHT_THEME.label,
    marginVertical: 10,
  },
  picker: {
    color: LIGHT_THEME.pickerText,
    backgroundColor: LIGHT_THEME.pickerBackground,
  },
  tabContent: {
    padding: 20,
    flex: 1,
    backgroundColor: LIGHT_THEME.background,
  },
});