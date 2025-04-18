import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";   // Import Home Page
import LoginUser from "./pages/LoginUser"; // Import Login Page
import RegisterUser from "./pages/RegisterUser"; // Import Register Page
import FlightPage from "./pages/FlightPage"; // The new FlightPage page
import BusPage from "./pages/BusPage";
import TrainPage from "./pages/TrainPage"; 
import TicketsPage from "./pages/TicketsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-user" element={<LoginUser />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/flights" element={<FlightPage />} /> {/* Add this */}
        <Route path="/bus" element={<BusPage  />} /> {/* Add this */}
        <Route path="/train" element={<TrainPage  />} /> {/* Add this */}
        {/* <Route path="/flights" element={<FlightsPage />} />
        <Route path="/bus" element={<BusPage />} />
        <Route path="/train" element={<TrainPage />} /> */}
        <Route path="/tickets" element={<TicketsPage />} />
        {/* <Route path="/agency-home" element={<TravelAgencyHome />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
