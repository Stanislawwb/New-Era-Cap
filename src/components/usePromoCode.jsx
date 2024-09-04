import { useState, useEffect } from "react";

const usePromoCode = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [error, setError] = useState(false);

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
    const deliveryInfo =
      JSON.parse(sessionStorage.getItem("deliveryInfo")) || {};

    if (finalTotal < 50) {
      finalTotal += parseFloat(deliveryInfo.price || 0);
    }

    const promoCode = promoCodes.find((code) => code.name === appliedPromoCode);

    if (promoCode) {
      const discountAmount = (subTotal * promoCode.discount) / 100;
      finalTotal -= discountAmount;
      sessionStorage.setItem("total", finalTotal.toFixed(2));
    } else {
      setError(true);
    }
  };

  return { applyPromoCode, error };
};

export default usePromoCode;
