import Steps from "../components/Steps";
import DetailsForm from "../components/DetailsForm";
import Sidebar from "../components/Sidebar";
import { DeliveryInfo, PromoCode } from "../types/detailsFormTypes";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

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

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
    } 

  }, [cartItems, navigate])

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
