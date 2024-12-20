import lock from "../../assets/icon-padlock.svg";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getSessionId } from "../../http/sessionService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store";
import { clearCart } from "../../state/cart/cartSlice";


const stripePromise = loadStripe('pk_test_51Puv0A00mgxSrJbWJhlocZak9KrcFDYou6mNhKTCfOL4aNmRwJTRxPFjahrKH1Kh1vVTaoNoX0Ger3z0Q2kYU8Wg00re94xIbn');

interface PaymentFormInputs {
  paymentMethod: string;
  nameOnCard: string;
}

interface PaymentFormProps {
  parentTotal: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ parentTotal }) => {
  const [isCardChecked, setIsCardChecked] = useState<boolean>(false);
  const [isPaypalChecked, setIsPaypalChecked] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormInputs>();

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
      const sessionId = getSessionId();

      const paymentData = {
        sessionId: sessionId,
        paymentMethodId: paymentMethod.id,
        amount: parentTotal.toFixed(2),
        currency: "EUR",
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

        dispatch(clearCart());
        sessionStorage.clear();
        
        navigate("/");
      } catch (error) {
        console.error("Error saving payment data:", error);
      }
    }
  };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMethod = event.target.value;
    setIsCardChecked(selectedMethod === "card");
    setIsPaypalChecked(selectedMethod === "paypal");
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
              onChange={handlePaymentMethodChange}
            />
            <label htmlFor="paypal">Paypal</label>
          </div>

          <div className="form__group">
            <input
              type="radio"
              id="card"
              value="card"
              {...register("paymentMethod")}
              onChange={handlePaymentMethodChange}
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

        { isPaypalChecked ? (
          <Link to="#" className="form__paypal-link btn" >
            Pay with PayPal 
          </Link>
        ) : (
          <button type="submit" className="btn btn--small" disabled={!stripe}>
            Place Order
          </button>
        )}

      </div>        
    </form>
  );
};

const Payment: React.FC<PaymentFormProps> = ({ parentTotal }) =>   (
  <Elements stripe={stripePromise} options={{ locale: "en" }}>
    <PaymentForm parentTotal={parentTotal} />
  </Elements>
);

export default Payment;
