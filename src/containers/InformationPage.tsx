import Steps from "../components/Steps";
import DetailsForm from "../components/DetailsForm";
import Sidebar from "../components/Sidebar";
import { DeliveryInfo, PromoCode } from "../types/detailsFormTypes";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const InformationPage: React.FC = () => {
  const [delivery, setDelivery] = useState<DeliveryInfo>({
    method: "standard",
    price: 0,
  });

  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode>({
    name: null,
    amount: 0,
    value: "",
    discount: 0,
  })

  const navigate = useNavigate();
  
  
  useEffect(() => {
    const hasProductsInCart = localStorage.getItem('cartItems');
    
    if (!hasProductsInCart) {
      navigate('/');
    } 
  }, [navigate])



  return (
    <div className="main">
      <div className="shell">
        <Steps />

        <div className="section-form">
          <DetailsForm setDelivery={setDelivery} appliedPromoCode={appliedPromoCode} />

          <Sidebar delivery={delivery} setAppliedPromoCode={setAppliedPromoCode} />
        </div>
      </div>
    </div>
  );
};

export default InformationPage;
