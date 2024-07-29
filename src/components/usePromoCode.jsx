import { useState, useEffect } from "react";

const usePromoCode = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [appliedPromoCode, setAppliedPromoCode] = useState(null);
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

  const applyPromoCode = (code) => {
    setError(false);
    if (promoCodes.some((promo) => promo.name === code)) {
      setAppliedPromoCode(code);
    } else {
      setError(true);
    }
  };

  return { promoCodes, appliedPromoCode, applyPromoCode, error };
};

export default usePromoCode;
