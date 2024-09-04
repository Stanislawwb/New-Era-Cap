import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InformationPage from "./InformationPage";
import PaymentPage from "./PaymentPage";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<InformationPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
