export interface Activity {
  id: string;
  name: string;
  category: string;
}

export const PREDEFINED_ACTIVITIES: Activity[] = [
  { id: 'h1', name: 'Hiking', category: 'hobbies' },
  { id: 'h2', name: 'Board Games', category: 'hobbies' },
  { id: 's1', name: 'Massage', category: 'sex' },
  { id: 's2', name: 'Role Play', category: 'sex' },
  { id: 'd1', name: 'Meditation', category: 'de-stress' },
  { id: 'd2', name: 'Bubble Bath', category: 'de-stress' },
  { id: 'r1', name: 'Candlelit Dinner', category: 'romantic' },
  { id: 'r2', name: 'Stargazing', category: 'romantic' },
  { id: 'p1', name: 'Tickle Fight', category: 'playful' },
  { id: 'p2', name: 'Pillow Fort', category: 'playful' },
];

export interface ThemeColors {
  background: string;
  text: string;
  title: string;
  border: string;
  tabBarBackground: string;
  tabBarActive: string;
  inputBorder: string;
  buttonText: string;
}

export const LIGHT_THEME: ThemeColors = {
  background: '#fff',
  text: '#6b4e5f',
  title: '#4a2c3d',
  border: '#f5e6f0',
  tabBarBackground: '#f5e6f0',
  tabBarActive: '#4a2c3d',
  inputBorder: '#4a2c3d',
  buttonText: '#fff',
};

export const DARK_THEME: ThemeColors = {
  background: '#1a1a1a',
  text: '#d9c2d0',
  title: '#e6b8cc',
  border: '#3d2c35',
  tabBarBackground: '#3d2c35',
  tabBarActive: '#e6b8cc',
  inputBorder: '#e6b8cc',
  buttonText: '#1a1a1a',
};