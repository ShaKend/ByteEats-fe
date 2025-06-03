import React from 'react';
import NavigationStack from './navigations/NavigationStack';
import { UserProvider } from 'context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <NavigationStack/>
    </UserProvider>
  );
}
