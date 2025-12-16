export default function Layout({ children }) {
  return (
    <div
      className="common-bg"
      style={{
        backgroundImage: "url('/bg1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "top -200px",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Blur Layer */}
      <div
        className="blur-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(5px)",
        }}
      ></div>

      {/* Page Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
