import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import lock from "../assets/icon-padlock.svg";

const Header: React.FC = () => {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={logo} alt="" />
      </Link>

      <div className="header__access">
        <img src={lock} alt="" />
        <p>Secure Checkout</p>
      </div>
    </header>
  );
};

export default Header;
