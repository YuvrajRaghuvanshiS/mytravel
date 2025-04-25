// src/pages/Home.js
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "../styles/styles.css"; // Importing the updated CSS

function Home() {
  return (
    <>
      <Navbar />
      <div className="hero-container">
        <div className="hero-text">
          <h1>See Places. Travel Easy.</h1>
          <p>
            Book flights, trains, and buses with secure Web3 powered ticketing.
          </p>
          <div className="hero-buttons">
            {/* <button>Explore Now</button>
            <button>Learn More</button> */}
          </div>
        </div>
      </div>

      <div className="bottom-section">
        <h2>
          Trusted by thousands of travelers and leading service providers across
          India.
        </h2>
      </div>
    </>
  );
}

export default Home;
