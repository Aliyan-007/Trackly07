import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Route, Switch, Redirect } from 'wouter';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Habits } from './pages/Habits';
import { Timetable } from './pages/Timetable';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Assistant } from './pages/Assistant';
import { AuthPage } from './pages/Auth';
import { AppLayout } from './layouts/AppLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTracklyStore } from './stores/useTracklyStore';
import { CloudSync } from './contexts/CloudSync';

function Workspace({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuth();
  if (loading) return <div />;
  if (configured && !user) return <Redirect to="/sign-in" />;
  return <AppLayout>{children}</AppLayout>;
}
function Theme() {
  const theme = useTracklyStore((state) => state.preferences.theme);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  return null;
}
function Routes() {
  return <><Theme /><CloudSync /><Switch>
    <Route path="/" component={Landing} />
    <Route path="/sign-in">{() => <AuthPage mode="sign-in" />}</Route>
    <Route path="/sign-up">{() => <AuthPage mode="sign-up" />}</Route>
    <Route path="/app">{() => <Workspace><Dashboard /></Workspace>}</Route>
    <Route path="/tasks">{() => <Workspace><Tasks /></Workspace>}</Route>
    <Route path="/habits">{() => <Workspace><Habits /></Workspace>}</Route>
    <Route path="/timetable">{() => <Workspace><Timetable /></Workspace>}</Route>
    <Route path="/analytics">{() => <Workspace><Analytics /></Workspace>}</Route>
    <Route path="/assistant">{() => <Workspace><Assistant /></Workspace>}</Route>
    <Route path="/settings">{() => <Workspace><Settings /></Workspace>}</Route>
    <Route>{() => <Landing />}</Route>
  </Switch></>;
}
export default function App() { return <AuthProvider><Routes /></AuthProvider>; }
