import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import lock from "../assets/icon-padlock.svg";

const Header: React.FC = () => {
  const location = useLocation();
  const showSecureCheckout = location.pathname === "/information" || location.pathname === '/payment'

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={logo} alt="" />
      </Link>

      {
        showSecureCheckout && (
          <div className="header__access">
            <img src={lock} alt="" />
            
            <p>Secure Checkout</p>
          </div>
        )
      }
    </header>
  );
};

export default Header;
