import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopWidth: 0,
          position: 'absolute',
          elevation: 0,
          height: 40,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="globe" size={size} color={color} />
          ),
        }}
      />
            <Tabs.Screen
        name="followingUsers"
        options={{
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="bookmarks" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="createPosts"
        options={{
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      /> 
    </Tabs>
  );
}