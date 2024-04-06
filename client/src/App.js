import Home from './pages/Home';
import AdminProfileCard from './pages/AdminProfileCard';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar';
import Footer from "./components/Footer"; 
import FullTicket from "./pages/FullTicket";
import { AuthProvider } from './authFile/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <div className="main-content">
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin_login" element={<Login />} />
              <Route path="/admin" element={<AdminProfileCard />} />
              <Route path="/tickets/:id" element={<FullTicket />} />
              <Route path="*" element={<div>404 Not Found</div>} />

            </Routes>
            <div class="wave"></div>

            <div class="wave"></div>

            <div class="wave"></div>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}



export default App;
