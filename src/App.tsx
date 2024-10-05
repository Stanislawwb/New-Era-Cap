import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InformationPage from "./containers/InformationPage";
import PaymentPage from "./containers/PaymentPage";
import Header from "./components/Header";

const App: React.FC = () => {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<InformationPage />} />
        
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
