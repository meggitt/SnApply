
import RegisterLogin from './components/RegisterLogin';
import UserDashboard from './components/UserDashboard';
import RecDashboard from './components/RecDashboard';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<RegisterLogin />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/recDashboard" element={<RecDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
