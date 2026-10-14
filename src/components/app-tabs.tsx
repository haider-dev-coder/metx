import { Tabs } from 'expo-router';
import { FeedProvider } from '@/context/feed-context';
import { Ionicons } from '@expo/vector-icons';
import { ColorValue } from 'react-native';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, selectedName, focused, color }: {
  name: IoniconsName;
  selectedName: IoniconsName;
  focused: boolean;
  color: ColorValue;
}) {
  return <Ionicons name={focused ? selectedName : name} size={24} color={color} />;
}

export function AppTabs() {
  return (
    <FeedProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0095f6',
          tabBarInactiveTintColor: '#999',
          tabBarActiveBackgroundColor: 'transparent',
          tabBarItemStyle: {
            backgroundColor: 'transparent',
          },
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e5e5e5',
            height: 75,
            paddingBottom: 12,
            paddingTop: 4,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="home-outline" selectedName="home" focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="chatbubble-outline" selectedName="chatbubble" focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="compass-outline" selectedName="compass" focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="person-circle-outline" selectedName="person-circle" focused={focused} color={color} />
            ),
          }}
        />
      </Tabs>
    </FeedProvider>
  );
}