import lock from "../assets/icon-padlock.svg";
import { useState } from "react";
import { useForm } from "react-hook-form";

const CheckoutForm = () => {
  const [isCardChecked, setIsCardChecked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };
  const handleCardChange = (event) => {
    console.log("Radio button changed: ", event.target.value);
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
              onChange={handleCardChange}
              {...register("paymentMethod")}
            />

            <label htmlFor="paypal">PayPal</label>
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
                  <label htmlFor="cardNumber">
                    Card Number<span className="required">*</span>
                  </label>

                  <input
                    type="text"
                    id="cardNumber"
                    {...register("cardNumber", { required: true })}
                  />
                  {errors.cardNumber && (
                    <span className="error">Card number cannot be empty</span>
                  )}
                </div>

                <div className="form__row">
                  <label htmlFor="nameOnCard">
                    Name on Card{" "}
                    <span className="gray">(as written on card)</span>
                    <span className="required">*</span>
                  </label>

                  <input
                    type="text"
                    id="nameOnCard"
                    {...register("nameOnCard", { required: true })}
                  />
                  {errors.nameOnCard && (
                    <span className="error">Card holder cannot be empty</span>
                  )}
                </div>

                <div className="form__row form__row--flex">
                  <div className="form__row-item">
                    <label htmlFor="expiryDate">
                      Expiry Date <span className="required">*</span>
                    </label>

                    <input
                      type="text"
                      id="expiryDate"
                      placeholder="MM / YY"
                      {...register("expiryDate", { required: true })}
                    />
                    {errors.expiryDate && (
                      <span className="error">Expiry date cannot be empty</span>
                    )}
                  </div>

                  <div className="form__row-item">
                    <label htmlFor="securityCode">
                      Security Code <span className="required">*</span>
                    </label>

                    <input
                      type="text"
                      id="securityCode"
                      {...register("securityCode", { required: true })}
                    />
                    {errors.securityCode && (
                      <span className="error">
                        Verification code cannot be empty
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn--small">
          Place Order
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
