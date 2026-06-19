import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import Home from "./pages/Home";
import Money from "./pages/Money";
import Alarm from "./pages/Alarm";
import Location from "./pages/Location";
import Restaurant from "./pages/Restaurant";

function App() {
  const navigation = useNavigate();
  useEffect(() => {
    navigation("/money");
  }, []);

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/money" element={<Money />} />
      <Route path="/location" element={<Location />} />
      <Route path="alarm" element={<Alarm />} />
      <Route path="/restaurant" element={<Restaurant />} />
    </Routes>
  );
}

export default App;
