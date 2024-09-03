import Steps from "./components/Steps";
import Sidebar from "./components/Sidebar";
import PaymentForm from "./components/PaymentForm";

const PaymentPage = () => {
  return (
    <div className="main">
      <div className="shell">
        <Steps />

        <div className="section-form">
          <PaymentForm />

          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
