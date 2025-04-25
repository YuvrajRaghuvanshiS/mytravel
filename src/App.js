import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginUser from "./pages/LoginUser";
import RegisterUser from "./pages/RegisterUser";
import TicketsPage from "./pages/TicketsPage";
import ProfilePage from "./pages/ProfilePage";
import WalletPage from "./pages/WalletPage";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AgencyDashboard from "./pages/AgencyDashboard"; // ✅ NEW
import UpdateAgencyProfile from "./pages/UpdateAgencyProfile";
import AddTravelRoute from "./pages/AddTravelRoute";
import UpdateTravelPage from "./pages/UpdateTravelRoute"; // at the top
import AgencyWalletPage from "./pages/AgencyWalletPage";
import TravelPage from "./pages/TravelPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-user" element={<LoginUser />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/travel" element={<TravelPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/agency-dashboard" element={<AgencyDashboard />} />
        <Route path="/agency-profile" element={<UpdateAgencyProfile />} />
        <Route path="/add-travel" element={<AddTravelRoute />} />
        <Route path="/update-travel/:id" element={<UpdateTravelPage />} />
        <Route path="/agency-wallet" element={<AgencyWalletPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
