import Steps from "../components/Steps";
import DetailsForm from "../components/DetailsForm";
import Sidebar from "../components/Sidebar";
import { DeliveryInfo } from "../types/detailsFormTypes";
import React, { useState } from "react";

const InformationPage: React.FC = () => {
  const [delivery, setDelivery] = useState<DeliveryInfo>({
    method: "standard",
    price: 0,
  });

  return (
    <div className="main">
      <div className="shell">
        <Steps />

        <div className="section-form">
          <DetailsForm setDelivery={setDelivery} />
          <Sidebar delivery={delivery} />
        </div>
      </div>
    </div>
  );
};

export default InformationPage;
