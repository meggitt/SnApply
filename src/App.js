
import RegisterLogin from './components/RegisterLogin';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<RegisterLogin />} />
          <Route path="/register" element={<RegisterLogin2 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
