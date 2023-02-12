import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Portal from "./pages/Portal";
import RootPage from "./pages/RootPage";
import SnackState from "./contexts/SnackStates";
import Snack from "./components/Snack";

function App() {
  return (
    <SnackState>
      <Router>
        <Snack />
        <Routes>
          <Route path="/" element={<RootPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/portal" element={<Portal />} />
        </Routes>
      </Router>
    </SnackState>
  )
}

export default App
