import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InformationPage from "./InformationPage";
import PaymentPage from "./PaymentPage";
import Header from "./components/Header";
import { FormProvider } from "./components/FormContext";

function App() {
  return (
    <FormProvider>
      <Router>
        <Header />

        <Routes>
          <Route path="/login" element={<InformationPage />} />
          <Route path="/information" element={<InformationPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </Router>
    </FormProvider>
  );
}

export default App;
