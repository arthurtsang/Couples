import { FlatList, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { Activity, PREDEFINED_ACTIVITIES } from '../types';
import React from 'react';

interface IdeasScreenProps {
  title: string;
}

export default function IdeasScreen({ title }: IdeasScreenProps) {
  const [customActivity, setCustomActivity] = useState<string>('');
  const [customActivities, setCustomActivities] = useState<Activity[]>([]);

  const addCustomActivity = () => {
    if (customActivity.trim()) {
      const newActivity: Activity = {
        id: `c${Date.now()}`,
        name: customActivity,
        category: 'custom',
      };
      setCustomActivities([...customActivities, newActivity]);
      setCustomActivity('');
    }
  };

  const allActivities = [...PREDEFINED_ACTIVITIES, ...customActivities];

  const renderActivity = ({ item }: { item: Activity }) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityText}>
        {item.name} ({item.category})
      </Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={allActivities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a custom activity"
          value={customActivity}
          onChangeText={setCustomActivity}
        />
        <Button title="Add" onPress={addCustomActivity} color="#4a2c3d" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a2c3d',
    marginVertical: 20,
  },
  list: {
    width: '100%',
    paddingHorizontal: 20,
  },
  activityItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5e6f0',
  },
  activityText: {
    fontSize: 16,
    color: '#6b4e5f',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#4a2c3d',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    color: '#6b4e5f',
  },
});