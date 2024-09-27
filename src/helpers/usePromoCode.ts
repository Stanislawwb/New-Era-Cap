interface PromoCode {
  name: string;
  discount: number;
}

const usePromoCode = () => {
  const applyPromoCode = async (appliedPromoCode: string, subTotal: number): Promise<boolean> => {
    let finalTotal = subTotal;

    const deliveryInfo =
      JSON.parse(sessionStorage.getItem("deliveryInfo") || '{}');

    if (finalTotal < 50) {
      finalTotal += parseFloat(deliveryInfo.price || "0");
    }

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

        sessionStorage.setItem("total", finalTotal.toFixed(2));
        sessionStorage.setItem("codeName", promoCode.name);
        sessionStorage.setItem("codeAmount", discountAmount.toFixed(2));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error applying promo code:", error);

      return false;
    }
  };

  const removePromoCode = (subTotal: number): void => {
    sessionStorage.removeItem("codeName");
    sessionStorage.removeItem("codeAmount");
    sessionStorage.removeItem("promoCode");
    sessionStorage.setItem("total", subTotal.toString());
  };

  return { applyPromoCode, removePromoCode };
};

export default usePromoCode;
