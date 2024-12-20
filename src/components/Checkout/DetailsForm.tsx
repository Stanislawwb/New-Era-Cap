import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { createSession, getSessionById, updateSession } from "../../http/sessionService";
import { FormData, DeliveryInfo, Country, PromoCode } from "../../types/detailsFormTypes";
import useFetchUserCountry from "../../helpers/useFetchUserCountry";
import { getSessionId } from "../../http/sessionService";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";

interface DetailsFormProps {
  setDelivery: (delivery: DeliveryInfo) => void;
  appliedPromoCode: PromoCode;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ setDelivery, appliedPromoCode }) => {
  const [isManualAddress, setIsManualAddress] = useState<boolean>(false);
  const [showCompany, setShowCompany] = useState<boolean>(false);
  const [showAddressLine2, setShowAddressLine2] = useState<boolean>(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();
  const [localDelivery, setLocalDelivery] = useState<DeliveryInfo>({
    method: "standard",
    price: 0,
  });

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    const country = countries.find((c) => c.name === countryName);

    if (country) {
      setSelectedCountry(country);
      const updatedDelivery = { method: "standard", price: country.delivery.standard };
      setLocalDelivery(updatedDelivery);
      setDelivery(updatedDelivery);
    }
  };

  useEffect(() => {
    if (selectedCountry) {
      const updatedDelivery = { method: "standard", price: selectedCountry.delivery.standard };
      setLocalDelivery(updatedDelivery); 
      setDelivery(updatedDelivery);
    }
  }, [selectedCountry, setDelivery]);
  

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedCountry) {
      const method = e.target.id as "standard" | "express";
      const price =
      method === "standard"
      ? selectedCountry.delivery.standard
      : selectedCountry.delivery.express || 0;
      
      const updatedDelivery = { method, price };
      setLocalDelivery(updatedDelivery); 
      setDelivery({ method, price });
    }  
  };
  
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:3000/countries");
        
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }
        
        const data: Country[] = await response.json();
        
        data.sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(data);
      } catch (error) {
        console.log("Error fetching countries", error);
      }
    };
    
    fetchCountries();
  }, []);


  useFetchUserCountry(countries, setSelectedCountry, setDelivery, setValue);

  useEffect(() => {
    const populateFormFromSession = async () => {
      const sessionId = getSessionId();

      try {
        const existingSession = await getSessionById(sessionId);

        if (existingSession) {
          const { formData } = existingSession;
          
          setValue("email", formData.email);
          setValue("subscribe", formData.subscribe);
          setValue("country", formData.country);
          setValue("firstName", formData.firstName);
          setValue("lastName", formData.lastName);
          setValue("addressFinder", formData.addressFinder);
          setValue("tel", formData.tel);

          const country = countries.find(c => c.name === formData.country);
          if (country) {
            setSelectedCountry(country);
            setDelivery({
              method: formData.delivery.method,
              price: formData.delivery.price,
            });
          }

          if (formData.address) {
            setIsManualAddress(true);
            setValue("address", formData.address);
            setValue("city", formData.city);
            setValue("state", formData.state);
            setValue("postcode", formData.postcode);
          }
        }
      } catch (error) {
        console.log("Error fetching session data", error);
      }
    };

    if (countries.length > 0) {
      populateFormFromSession();
    }
  }, [countries, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {    
    try {
      const sessionId = getSessionId();
      const timestamp = new Date().toString();

      const existingSession = await getSessionById(sessionId);
  
      const sessionData = {
        sessionId,
        formData: {
          ...data,
          delivery: {
            method: localDelivery.method,
            price: localDelivery.price,
          },
        },
        cartItems,
        codeName: appliedPromoCode.name || null,  
        discountAmount: appliedPromoCode.amount || 0,
        discountInPercenTage: appliedPromoCode.discount,
        timestamp
      };

      if(existingSession) {
        await updateSession({...existingSession, ...sessionData});
      } else {
        await createSession(sessionData);
      }
  
      navigate("/payment");
    } catch (error) {
      console.error("Error during session creation:", error);
    }
  };

  return (
    <form className="form form--checkout" onSubmit={handleSubmit(onSubmit)}>
      <div className="form__inner">
        <div className="form__head">
          <div className="form__title-wrapper">
            <h2>Enter your details</h2>

            <p>
              <span className="required">*</span>Required
            </p>
          </div>

          <div className="form__row">
            <label htmlFor="email">
              Email{" "}
              <span className="gray">(for your order receipt and updates)</span>
              <span className="required">*</span>
            </label>

            <input
              type="email"
              id="email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="error">Please enter your email address</span>
            )}
          </div>

          <div className="form__checkbox">
            <input type="checkbox" id="subscribe" {...register("subscribe")} />

            <label htmlFor="subscribe">
              Sign up to our newsletter and receive exclusive offers and
              promotions. View our{" "}
              <Link to="/privacy-policy">Privacy Policy</Link> for more
              information.
            </label>
          </div>
        </div>

        <div className="form__body">
          <div className="form__title-wrapper">
            <h2>Delivery address</h2>
          </div>

          <div className="form__group">
            <div className="form__row">
              <label htmlFor="country">
                Country <span className="required">*</span>
              </label>

              <div className="form__select">
                <select
                  id="country"
                  {...register("country", { required: true, onChange: (e) => handleCountryChange(e) })}
                  value={selectedCountry ? selectedCountry.name : ""}
                >
                  {countries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form__group">
            <div className="form__row">
              <label htmlFor="firstName">
                First Name<span className="required">*</span>
              </label>

              <input
                type="text"
                id="firstName"
                {...register("firstName", { required: true })}
              />

              {errors.firstName && (
                <span className="error">First name is required</span>
              )}
            </div>
          </div>

          <div className="form__group">
            <div className="form__row">
              <label htmlFor="lastName">
                Last Name<span className="required">*</span>
              </label>

              <input
                type="text"
                id="lastName"
                {...register("lastName", { required: true })}
              />
              {errors.lastName && (
                <span className="error">Last name is required</span>
              )}
            </div>
          </div>

          <>
            {!showCompany && (
              <div
                className="form__group"
                onClick={() => setShowCompany(!showCompany)}
              >
                <button type="button">+ Add Company</button>
              </div>
            )}

            {showCompany && (
              <div className="form__group hidden">
                <div className="form__row">
                  <label htmlFor="company">
                    Company<span>(optional)</span>
                  </label>

                  <input type="text" name="company" id="company" />
                </div>
              </div>
            )}

            <div className="form__group">
              <div className="form__row">
                <label htmlFor="address">
                  House Number and Street Name
                  <span className="required">*</span>
                </label>

                <input
                  type="text"
                  id="address"
                  {...register("address", { required: isManualAddress })}
                />
                {errors.address && (
                  <span className="error">Address is required</span>
                )}
              </div>
            </div>

            {!showAddressLine2 && (
              <div className="form__group">
                <button
                  type="button"
                  onClick={() => setShowAddressLine2(!showAddressLine2)}
                >
                  + Add Address Line 2
                </button>
              </div>
            )}

            {showAddressLine2 && (
              <div className="form__group">
                <div className="form__row">
                  <label htmlFor="address-2">
                    Address Line 2<span> (optional)</span>
                  </label>

                  <input type="text" name="address-2" id="address-2" />
                </div>
              </div>
            )}

            <div className="form__group">
              <div className="form__row">
                <label htmlFor="city">
                  Town/City
                  <span className="required">*</span>
                </label>

                <input
                  type="text"
                  id="city"
                  {...register("city", { required: isManualAddress })}
                />
                {errors.city && (
                  <span className="error">City is required</span>
                )}
              </div>
            </div>

            <div className="form__group">
              <div className="form__row">
                <label htmlFor="state">
                  County/State <span>(optional)</span>
                  <span className="required">*</span>
                </label>

                <input
                  type="text"
                  id="state"
                  {...register("state", { required: isManualAddress })}
                />
                {errors.state && (
                  <span className="error">State is required</span>
                )}
              </div>
            </div>

            <div className="form__group">
              <div className="form__row">
                <label htmlFor="postcode">
                  Postcode
                  <span className="required">*</span>
                </label>

                <input
                  type="text"
                  id="postcode"
                  {...register("postcode", { required: isManualAddress })}
                />
                {errors.postcode && (
                  <span className="error">Postcode is required</span>
                )}
              </div>
            </div>
          </>

          <div className="form__group">
            <button
              type="button"
              onClick={() => setIsManualAddress(!isManualAddress)}
            >
              {isManualAddress
                ? "Back to address finder"
                : "Enter address manually"}
            </button>
          </div>

          <div className="form__group">
            <div className="form__row">
              <label htmlFor="tel">
                Phone Number{" "}
                <span className="gray">(in case of delivery questions)</span>
                <span className="required">*</span>
              </label>

              <input
                type="tel"
                id="tel"
                placeholder="eg. 07700901235"
                {...register("tel", { required: isManualAddress })}
              />
              {errors.tel && (
                <span className="error">Phone number is required</span>
              )}
            </div>
          </div>
        </div>

        <div className="form__foot">
          {selectedCountry && (
            <>              
              <div className="form__title-wrapper">
                <h2>Delivery Method</h2>
              </div>

              <div className="form__radio">
                <div className="form__group">
                  <input
                    type="radio"
                    id="standard"
                    value={selectedCountry.delivery.standard
                        .toFixed(2)
                        .replace(".", ",")}
                    checked={localDelivery.method === "standard"}
                    {...register("delivery", {onChange: (e) => handleDeliveryChange(e)})}
                  />

                  <label htmlFor="standard">
                    <div className="form__radio-info">
                      Delivered: <span>Standard (3-6 working days)</span>{" "}
                      <span className="gray">Standard</span>
                    </div>

                    <span>
                      €
                      {selectedCountry.delivery.standard
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                  </label>
                </div>
              </div>
              
              {selectedCountry.delivery.express && (
                <div className="form__radio">
                  <div className="form__group">
                    <input
                      type="radio"
                      id="express"
                      value={selectedCountry.delivery.express
                        .toFixed(2)
                        .replace(".", ",")}
                      checked={localDelivery.method === "express"}
                      {...register("delivery", { onChange: (e) => handleDeliveryChange(e) })}
                    />

                    <label htmlFor="express">
                      <div className="form__radio-info">
                        Delivered:{" "}
                        <span>Delivery within 1 to 2 working days.</span>
                        <span className="gray">Express</span>
                      </div>

                      <span>
                        €
                        {selectedCountry.delivery.express
                          .toFixed(2)
                          .replace(".", ",")}
                      </span>
                    </label>
                  </div>
                </div>
              )}{" "}
            </>
          )}

          <div className="form__notes">
            <p>
              If you encounter payment problems on our site, please use PayPal
              or another credit card to complete your purchase.
            </p>
            <p>
              If the problem persists contact us by email at{" "}
              <a href="mailto:customer.care@neweracap.com">
                customer.care@neweracap.com
              </a>
            </p>
          </div>
        </div>

        <button type="submit" className="btn">
          Proceed to Payment
        </button>
      </div>
    </form>
  );
};

export default DetailsForm;
