import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../styles/home.css"; // Use the new CSS file

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="homepage-hero">
        <div className="homepage-hero-content">
          <h1>See Places. Travel Easy.</h1>
          <p>
            Book flights, trains, and buses with secure Web3 powered ticketing.
          </p>
          <div className="homepage-cta-buttons">
            <button
              className="homepage-login-btn"
              onClick={() => navigate("/login-user")}
            >
              Login
            </button>
            <button
              className="homepage-register-btn"
              onClick={() => navigate("/register-user")}
            >
              Register
            </button>
          </div>
        </div>
      </div>

      <section className="homepage-features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span role="img" aria-label="secure" className="feature-icon">
              🔒
            </span>
            <h3>Secure & Private</h3>
            <p>
              Blockchain-powered ticketing ensures your bookings are
              tamper-proof and private.
            </p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="fast" className="feature-icon">
              ⚡
            </span>
            <h3>Fast Booking</h3>
            <p>
              Book flights, trains, and buses in seconds with our streamlined
              platform.
            </p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="support" className="feature-icon">
              💬
            </span>
            <h3>24/7 Support</h3>
            <p>
              Our team is always here to help you, anytime you need assistance.
            </p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="deals" className="feature-icon">
              🎫
            </span>
            <h3>Best Deals</h3>
            <p>Get the best prices and exclusive offers on every booking.</p>
          </div>
        </div>
      </section>

      <section className="homepage-bottom-section">
        <h2>
          Trusted by thousands of travelers and leading service providers across
          India.
        </h2>
        <div className="trusted-logos">
          <span className="trusted-logo">✈️</span>
          <span className="trusted-logo">🚆</span>
          <span className="trusted-logo">🚌</span>
          <span className="trusted-logo">🌐</span>
        </div>
      </section>
    </>
  );
}

export default Home;
