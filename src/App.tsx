import { Route, Routes, Navigate } from "react-router";
import { useAuth, AuthProvider } from "./providers/AuthProvider";
import Home from "./pages/Home";
import Money from "./pages/Money";
import Alarm from "./pages/Alarm";
import Information from "./pages/Information";
import Restaurant from "./pages/Restaurant";
import Login from "./pages/Login";
import Pending from "./pages/Pending";

function AppShell() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/money" element={<Money />} />
      <Route path="/information" element={<Information />} />
      <Route path="alarm" element={<Alarm />} />
      <Route path="/restaurant" element={<Restaurant />} />
      <Route path="/pending" element={<Pending />} />
      <Route path="/*" element={<Navigate to="/home" />} />
    </Routes>
  );
}
function AppRoutes() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <AppShell />;
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
