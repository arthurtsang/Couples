import { StyleSheet } from 'react-native';

export const DARK_THEME = {
  background: '#1a1a1a',
  text: '#d9c2d0',
  title: '#e6b8cc',
  border: '#3d2c35',
  tabBarBackground: '#3d2c35',
  tabBarActive: '#e6b8cc',
  inputBorder: '#e6b8cc',
  buttonText: '#1a1a1a',
  pickerText: '#ffffff', // White for max contrast
  pickerBackground: '#333333', // Slightly lighter gray
  datePickerText: '#e6b8cc',
  modalBackground: '#1a1a1a',
  label: '#e6b8cc',
};

export const darkStyles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: DARK_THEME.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: DARK_THEME.title,
    marginVertical: 20,
  },
  list: {
    width: '100%',
    paddingHorizontal: 20,
  },
  partnerItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: DARK_THEME.border,
    marginVertical: 5,
  },
  partnerText: {
    fontSize: 16,
    color: DARK_THEME.text,
    marginBottom: 10,
  },
  modal: {
    flex: 1,
    padding: 20,
    backgroundColor: DARK_THEME.modalBackground,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_THEME.title,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: DARK_THEME.inputBorder,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
    color: DARK_THEME.text,
  },
  label: {
    fontSize: 16,
    color: DARK_THEME.label,
    marginVertical: 10,
  },
  picker: {
    color: DARK_THEME.pickerText,
    backgroundColor: DARK_THEME.pickerBackground,
  },
  tabContent: {
    padding: 20,
    flex: 1,
    backgroundColor: DARK_THEME.background,
  },
});