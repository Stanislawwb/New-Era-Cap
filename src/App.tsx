import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InformationPage from "./containers/InformationPage";
import PaymentPage from "./containers/PaymentPage";
import Header from "./components/Header";
import Homepage from "./containers/Homepage";
import NotFoundPage from "./containers/NotFoundPage";

const App: React.FC = () => {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Homepage />} />

        <Route path="/information" element={<InformationPage />} />
        
        <Route path="/payment" element={<PaymentPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
