import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // 🔹 Hide search on search + history pages
  const hideSearch =
    location.pathname === "/search" ||
    location.pathname === "/history";

  const isHistoryPage = location.pathname === "/history";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav id="nav">
      {/* LOGO */}
      <div className="logo-container" onClick={() => navigate("/")}>
        <div className="logo-img">
          <img src="/logo.png" alt="logo" />
        </div>
        <div className="logo-text">SmartDine</div>
      </div>

      {/* LEFT SIDE LINKS */}
      <div className="list">
        <ul>
          <li onClick={() => navigate("/")}>HOME</li>

          {token && (
            <li
              onClick={() => {
                if (!isHistoryPage) navigate("/history");
              }}
              style={{
                opacity: isHistoryPage ? 0.6 : 1,
                cursor: isHistoryPage ? "default" : "pointer",
              }}
            >
              HISTORY
            </li>
          )}

          {!token && (
            <>
              <li onClick={() => navigate("/login")}>LOGIN</li>
              <li onClick={() => navigate("/signup")}>SIGNUP</li>
            </>
          )}
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div
        className="list1"
        style={{ display: "flex", alignItems: "center", gap: "16px" }}
      >

        {token && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontFamily: "Sentient, serif",
                fontSize: "18px",
                fontWeight: 600,
                color: "#f97316",
              }}
              >
              {username}
            </span>

              {!hideSearch && (
                <button className="search" onClick={() => navigate("/search")}>
                  <span>SEARCH</span>
                </button>
              )}
            <button className="search" onClick={handleLogout}>
              <span>LOGOUT</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
