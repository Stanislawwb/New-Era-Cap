import Steps from "./components/Steps";
import Sidebar from "./components/Sidebar";
import CheckoutForm from "./components/CheckoutForm";

const PaymentPage = () => {
  return (
    <div className="main">
      <div className="shell">
        <Steps />

        <div className="section-form">
          <CheckoutForm />

          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
