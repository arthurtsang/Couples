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

export interface Anniversary {
  name: string;
  date: Date;
}

export interface Preference {
  name: string;
  isLike: boolean;
}

export interface Partner {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  intimateName: string;
  preferredName: 'firstName' | 'lastName' | 'nickName' | 'intimateName';
  anniversaries: Anniversary[];
  preferences: Preference[];
  email: string;
  phone: string;
  address: string;
  notes: string;
}

export const COMMON_PREFERENCES = [
  'Coffee',
  'Chocolate',
  'Flowers',
  'Movies',
  'Spicy Food',
  'Books',
  'Wine',
  'Loud Music',
];

export type ThemeColors = typeof import('./theme/light').LIGHT_THEME;