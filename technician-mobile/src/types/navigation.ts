// src/types/navigation.ts

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Preferences: undefined;
  Calendar: undefined;
  TechnicianDashboard: undefined;
  Notifications: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}