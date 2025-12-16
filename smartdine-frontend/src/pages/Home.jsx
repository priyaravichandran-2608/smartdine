
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../pages/Homepage.css";
import Navbar from "../components/Navbar";
import Testimonials from "../pages/Testimonials";


export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      id="landing-page"
      className="landing-page"
      style={{
        backgroundImage: "url('/bg1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "top -200px",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* BLUR LAYER */}
      <div className="blur-overlay"></div>

      <Navbar />

      {/* HOME SECTION */}
      <section id="home">
        <div className="main1">It's not just food, It's an experience.</div>

        <div className="banner">
          <div className="slider" style={{ "--quantity": 6 }}>
            <div className="item" style={{ "--position": 1 }}>
              <img src="/pizzaa.png" alt="" />
            </div>
            <div className="item" style={{ "--position": 2 }}>
              <img src="/burger.png" alt="" />
            </div>
            <div className="item" style={{ "--position": 3 }}>
              <img src="/wrap.png" alt="" />
            </div>
            <div className="item" style={{ "--position": 4 }}>
              <img src="/noodles.png" alt="" />
            </div>
            <div className="item" style={{ "--position": 5 }}>
              <img src="/chips.png" alt="" />
            </div>
            <div className="item" style={{ "--position": 6 }}>
              <img src="/cake.png" alt="" />
            </div>
          </div>
        </div>

     <div style={{ marginTop: "90px", position: "relative", zIndex: 5 }}>
  <button className="explore-btn" onClick={() => navigate("/search")}>
    Explore →
  </button>

  <p
    style={{
      marginTop: "20px",
      fontFamily: "Sentient, serif",
      fontSize: "20px",
      color: "white",
      textAlign: "center",
      width: "80%",
      maxWidth: "600px",
      marginLeft: "auto",
      marginRight: "auto",
      opacity: 0.9,
    }}
  >
    Powered by SmartDine AI — Get personalized restaurant and dish recommendations 
    based on mood, cravings, dining style, and city insights.
  </p>
</div>


      </section>

      <div className="mb-20">
        <Testimonials />
      </div>

      <Footer />
    </div>
  );
}
