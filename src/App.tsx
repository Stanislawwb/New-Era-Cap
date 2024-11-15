import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./containers/CheckoutPage";
import PaymentPage from "./containers/PaymentPage";
import Header from "./components/Header";
import Homepage from "./containers/Homepage";
import NotFoundPage from "./containers/NotFoundPage";
import { store } from "./state/store";
import { Provider } from "react-redux";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<Homepage />} />

          <Route path="/checkout" element={<Checkout />} />          
          
          <Route path="/payment" element={<PaymentPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
