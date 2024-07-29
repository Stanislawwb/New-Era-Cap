import { createContext, useState } from "react";

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({});

  const [deliveryInfo, setDeliveryInfo] = useState({
    method: "standard",
    price: 0,
  });

  const [promoCode, setPromoCode] = useState(null);
  const [total, setTotal] = useState(0);

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        deliveryInfo,
        setDeliveryInfo,
        promoCode,
        setPromoCode,
        total,
        setTotal,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
