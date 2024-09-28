import lock from "../assets/icon-padlock.svg";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { DeliveryDetailsProps } from "./DeliveryDetails";

const stripePromise = loadStripe(
  "pk_test_51Puv0A00mgxSrJbWJhlocZak9KrcFDYou6mNhKTCfOL4aNmRwJTRxPFjahrKH1Kh1vVTaoNoX0Ger3z0Q2kYU8Wg00re94xIbn"
);


interface PaymentFormInputs {
  paymentMethod: string;
  nameOnCard: string;
}

interface PaymentData {
  paymentMethodId: string;
  amount: string;
  currency: string;
  deliveryInfo: DeliveryDetailsProps['deliveryMethod'];
  formData: DeliveryDetailsProps['details'];
}

const PaymentForm: React.FC = () => {
  const [isCardChecked, setIsCardChecked] = useState<boolean>(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormInputs>();

  const formData: DeliveryDetailsProps['details'] = JSON.parse(sessionStorage.getItem("formData") || "{}");
  const deliveryInfo: DeliveryDetailsProps['deliveryMethod'] = JSON.parse(sessionStorage.getItem("deliveryInfo") || "{}");
  const total: string = JSON.parse(sessionStorage.getItem("total") || "0");

  const stripe = useStripe();
  const elements = useElements();

  const onSubmit: SubmitHandler<PaymentFormInputs> = async (data) => {
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if(!cardElement) {
      console.log('Card element not found');

      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: data.nameOnCard,
      },
    });

    if (error) {
      console.log("[error]", error);
    } else {
      const paymentData = {
        paymentMethodId: paymentMethod.id,
        amount: parseFloat(total).toFixed(2),
        currency: "EUR",
        deliveryInfo,
        formData,
      };

      try {
        const response = await fetch("http://localhost:3000/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
          throw new Error("failed to save payment data");
        }

        const result = await response.json();

        sessionStorage.clear();

        navigate("/");
      } catch (error) {
        console.error("Error saving payment data:", error);
      }
    }
  };

  const handleCardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCardChecked(event.target.value === "card");
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form__inner">
        <div className="form__title-wrapper">
          <h2>Payment Method</h2>
          <img src={lock} alt="" />
        </div>
        <div className="form__foot">
          <div className="form__group">
            <input
              type="radio"
              id="paypal"
              value="paypal"
              {...register("paymentMethod")}
              onChange={handleCardChange}
            />
            <label htmlFor="paypal">Paypal</label>
          </div>
          <div className="form__group">
            <input
              type="radio"
              id="card"
              value="card"
              {...register("paymentMethod")}
              onChange={handleCardChange}
            />
            <label htmlFor="card">Card</label>
            {isCardChecked && (
              <>
                <div className="form__row">
                  <CardElement />
                </div>
              </>
            )}
          </div>
        </div>
        <button type="submit" className="btn btn--small" disabled={!stripe}>
          Place Order
        </button>
      </div>
    </form>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise} options={{ locale: "en" }}>
    <PaymentForm />
  </Elements>
);

export default Payment;
