import { useState, useEffect, useContext } from "react";
import { FormContext } from "./FormContext";

const usePromoCode = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [error, setError] = useState(false);

  const { deliveryInfo, setTotal } = useContext(FormContext);

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const response = await fetch("http://localhost:3000/promoCodes");
        if (!response.ok) throw new Error("Failed to fetch promo codes");
        const data = await response.json();
        setPromoCodes(data);
      } catch (error) {
        console.error("Error fetching promo codes:", error);
      }
    };

    fetchPromoCodes();
  }, []);

  const applyPromoCode = (appliedPromoCode, subTotal) => {
    setError(false);

    let finalTotal = parseFloat(subTotal);

    if (finalTotal < 50) {
      finalTotal += parseFloat(deliveryInfo.price);
    }

    const promoCode = promoCodes.find((code) => code.name === appliedPromoCode);

    if (promoCode) {
      const discountAmount = (subTotal * promoCode.discount) / 100;
      finalTotal = subTotal - discountAmount;
    }

    setTotal(finalTotal.toFixed(2));
  };

  return { promoCodes, applyPromoCode, error };
};

export default usePromoCode;
