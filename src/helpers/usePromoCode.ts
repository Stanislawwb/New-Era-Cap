interface PromoCode {
  name: string;
  discount: number;
}

const usePromoCode = (updatePromoCode: (promoCode: { name: string; amount: number; total: string }) => void) => {
  const applyPromoCode = async (appliedPromoCode: string, subTotal: number): Promise<{ name: string; discount: number; amount: number } | null> => {
    let finalTotal = subTotal;
  
    try {
      const response = await fetch(
        `http://localhost:3000/promoCodes?name=${appliedPromoCode}`
      );
  
      if (!response.ok) {
        throw new Error("Promo code is invalid or not found");
      }
  
      const [promoCode]: PromoCode[] = await response.json();
  
      if (promoCode) {
        const discountAmount = (subTotal * promoCode.discount) / 100;
        finalTotal -= discountAmount;
  
        return {
          name: promoCode.name,
          amount: discountAmount,
          discount: promoCode.discount,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      return null;
    }
  };
  

  const removePromoCode = (subTotal: number): void => {
    updatePromoCode({
      name: "",
      amount: 0,
      total: subTotal.toFixed(2),
    });
  };

  return { applyPromoCode, removePromoCode };
};

export default usePromoCode;
