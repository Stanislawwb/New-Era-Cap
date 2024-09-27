import Steps from "../components/Steps";
import DetailsForm from "../components/DetailsForm";
import Sidebar from "../components/Sidebar";

const InformationPage = () => {
  return (
    <div className="main">
      <div className="shell">
        <Steps />

        <div className="section-form">
          <DetailsForm />

          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default InformationPage;
