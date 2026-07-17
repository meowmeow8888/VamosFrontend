import { Route, Routes, Navigate } from "react-router";
import Home from "./pages/Home";
import Money from "./pages/Money";
import Alarm from "./pages/Alarm";
import Location from "./pages/Location";
import Restaurant from "./pages/Restaurant";
import { useAuth, AuthProvider } from "./providers/AuthProvider";
import Login from "./pages/Login";

function AppShell() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/money" element={<Money />} />
      <Route path="/location" element={<Location />} />
      <Route path="alarm" element={<Alarm />} />
      <Route path="/restaurant" element={<Restaurant />} />
      <Route path="/*" element={<Navigate to="/home" />} />
    </Routes>
  );
}
function AppRoutes() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return <AppShell />;
}
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
