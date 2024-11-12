import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import lock from "../assets/icon-padlock.svg";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

const Header: React.FC = () => {
  const location = useLocation();
  const showSecureCheckout = location.pathname === "/information" || location.pathname === '/payment';
  const productsInCart = useSelector((state: RootState) => state.cart.cartItems);

  const productsInCartCount =  productsInCart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={logo} alt="" />
      </Link>

      {
        showSecureCheckout ? (
          <div className="header__access">
            <img src={lock} alt="" />
            
            <p>Secure Checkout</p>
          </div>
        ) : (
          <Link to='/information' className="header__cart" style={ productsInCartCount === 0 ? { pointerEvents: 'none'} : {}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M10 19.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm3.5-1.5c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm1.336-5l1.977-7h-16.813l2.938 7h11.898zm4.969-10l-3.432 12h-12.597l.839 2h13.239l3.474-12h1.929l.743-2h-4.195z"/>
            </svg>

            <span>{productsInCartCount}</span>
          </Link>
        )
      }    
    </header>
  );
};

export default Header;
