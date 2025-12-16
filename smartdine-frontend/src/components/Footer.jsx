import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-grid">

        {/* Brand */}
        <div>
          <h1 className="footer-brand">SmartDine</h1>

          <p className="footer-desc">
            © 2025 SmartDine <br />
            Your AI Food Discovery Partner
          </p>

       <div className="footer-socials">
  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
    {/* Instagram SVG */}
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5zm5.3-2.9a1.05 1.05 0 1 0 1.05 1.05A1.05 1.05 0 0 0 17.3 5.6zM12 10.5A1.5 1.5 0 1 1 10.5 12 1.5 1.5 0 0 1 12 10.5z"/>
    </svg>
  </a>

  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
    {/* Facebook SVG */}
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8.9V12h1.6V9.8c0-1.6 1-2.5 2.4-2.5.7 0 1.4.1 1.4.1v1.6h-.8c-.8 0-1 0-1 1v1.2h1.7l-.3 2.9h-1.4v7A10 10 0 0 0 22 12z"/>
    </svg>
  </a>

  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
    {/* Twitter SVG */}
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 5.9c-.6.3-1.2.5-1.9.6a3.3 3.3 0 0 0-5.7 3c0 .3 0 .6.1.9-2.7-.1-5.1-1.4-6.7-3.4-.3.6-.5 1.3-.5 2a3.3 3.3 0 0 0 1.5 2.7c-.5 0-1-.1-1.4-.4 0 1.8 1.3 3.3 3 3.6-.5.2-1 .2-1.6.1.5 1.6 2 2.7 3.7 2.7A6.7 6.7 0 0 1 4 19.6a9.4 9.4 0 0 0 5.1 1.5c6.1 0 9.5-5 9.5-9.4v-.4c.6-.4 1.2-.9 1.6-1.5-.6.3-1.3.5-2 .6z"/>
    </svg>
  </a>

  {/* Swiggy */}
  <a href="https://www.swiggy.com" target="_blank" rel="noopener noreferrer" aria-label="Swiggy">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {/* simplified Swiggy-like flame/marker shape; fill follows currentColor */}
      <path d="M12 2C9.3 5 7 7.3 7 10.2 7 13.8 10.1 17 12 19c1.9-2 5-5.2 5-8.8C17 7.3 14.7 5 12 2zM12 12.5a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6z"/>
    </svg>
  </a>

  {/* Zomato */}
  <a href="https://www.zomato.com" target="_blank" rel="noopener noreferrer" aria-label="Zomato">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {/* simplified 'Z' / mark shape, fill follows currentColor */}
      <path d="M4 4h12v2H8v4h8v2H8v6H4z"/>
    </svg>
  </a>
</div>


        </div>

        {/* Company */}
        <div>
          <h3 className="footer-title">Company</h3>
          <ul className="footer-list">
            <li>About Us</li>
            <li>Careers</li>
            <li>Team</li>
            <li>Blog</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="footer-title">Contact</h3>
          <ul className="footer-list">
            <li>Help & Support</li>
            <li>Partner With Us</li>
            <li>Ride With Us</li>
            <li>Feedback</li>
          </ul>
        </div>

        {/* Locations */}
        <div>
          <h3 className="footer-title">Available In</h3>
          <ul className="footer-list">
            <li>Bangalore</li>
            <li>Chennai</li>
            <li>Mumbai</li>
            <li>Delhi</li>
            <li>Hyderabad</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        Made with ❤️ for food lovers everywhere.
      </div>
    </footer>
  );
}
