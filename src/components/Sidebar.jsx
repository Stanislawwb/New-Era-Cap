import React, { useContext, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { FormContext } from "./FormContext";
import { useLocation } from "react-router-dom";
import DeliveryDetails from "./DeliveryDetails";
import useSectionHeight from "./useSectionHeight";

const Sidebar = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTotal, setSubTotal] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState(null);

  const { deliveryInfo, promoCode, setPromoCode, total, setTotal } =
    useContext(FormContext);

  const [promoCodes, setPromoCodes] = useState([]);
  const [error, setError] = useState(false);

  const location = useLocation();
  const { formData } = useContext(FormContext);

  useEffect(() => {
    const fetchingData = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");

        if (!response.ok) {
          throw new Error("Bad response");
        }

        const data = await response.json();

        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.log("Error", error);
        setLoading(false);
      }

      try {
        const promoCodesResponse = await fetch(
          "http://localhost:3000/promoCodes"
        );

        if (!promoCodesResponse.ok) {
          throw new Error("Bad Response");
        }

        const promoCodesData = await promoCodesResponse.json();

        setPromoCodes(promoCodesData);
      } catch (error) {
        console.log("Error", error);
      }
    };

    fetchingData();
  }, []);

  // Subtotal Calculation
  useEffect(() => {
    setSubTotal(
      products.reduce((acc, product) => acc + product.price, 0).toFixed(2)
    );
  }, [products]);

  // Total Calculation
  useEffect(() => {
    let finalTotal = parseFloat(subTotal);

    if (appliedPromoCode) {
      const promoCode = promoCodes.find(
        (code) => code.name === appliedPromoCode
      );

      if (promoCode) {
        const discountAmount = (subTotal * promoCode.discount) / 100;
        finalTotal = subTotal - discountAmount;
      }
    }

    if (finalTotal < 50) {
      finalTotal += parseFloat(deliveryInfo.price);
    }

    setTotal(finalTotal.toFixed(2));
  }, [products, deliveryInfo.price, appliedPromoCode]);

  // Accordions Height
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [isPromoCodeOpen, setIsPromoCodeOpen] = useState(true);

  const { sectionHeight: sectionCartHeight, sectionRef: cartRef } =
    useSectionHeight(isCartOpen);
  const { sectionHeight: promoCodeHeight, sectionRef: promoCodeRef } =
    useSectionHeight(isPromoCodeOpen);

  // Promo Code
  const [promoCodeValue, setPromoCodeValue] = useState("");

  const handlePromoCode = (event) => {
    setPromoCodeValue(event.target.value);
  };

  const applyPromoCode = () => {
    setError(false);

    if (promoCodes.find((code) => code.name === promoCodeValue)) {
      setAppliedPromoCode(promoCodeValue);
    } else {
      setError(true);
      console.log("Invalid promo code");
    }
  };
  return (
    <div className="sidebar">
      <div className="sidebar__inner">
        <div className="sidebar__head">
          <h2>Order summary</h2>
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ClipLoader color="#000" loading={loading} size={150} />
            </div>
          )}

          <div className="sidebar__subtotal sidebar__row">
            <p>
              Subtotal{" "}
              <span>
                ({products.length} {products.length > 1 ? "items" : "item"})
              </span>
            </p>

            <span>€{subTotal}</span>
          </div>

          {subTotal >= 50 && (
            <div className="sidebar_shipping sidebar__row">
              <p>Free Shipping over 40GBP/50EUR</p>

              <span>-€ {deliveryInfo.price.toFixed(2).replace(",", ".")}</span>
            </div>
          )}

          <div className="sidebar__delivery sidebar__row">
            <p>Delivery</p>

            <span>
              {subTotal >= 50
                ? "Free"
                : "€" + deliveryInfo.price.toFixed(2).replace(",", ".")}
            </span>
          </div>
          <div className="sidebar__total sidebar__row">
            <p>Total</p>

            <span>€{total}</span>
          </div>
        </div>

        <div className="sidebar__body">
          <div
            className={`sidebar__body-title ${
              isPromoCodeOpen ? "is-active" : ""
            }`}
            onClick={() => setIsPromoCodeOpen(!isPromoCodeOpen)}
          >
            <h3>Promo Code</h3>

            <button type="button">
              <svg
                width="14"
                height="9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="m12.47.47 1.06 1.06L7 8.06.47 1.53 1.53.47 7 5.94 12.47.47Z"
                  fill="#666"
                ></path>
              </svg>
            </button>
          </div>

          <div
            className="sidebar__body-form"
            style={{ height: `${promoCodeHeight}px` }}
          >
            <form action="" ref={promoCodeRef}>
              <input
                type="text"
                placeholder="Enter Promo"
                value={promoCodeValue}
                onChange={handlePromoCode}
              />

              <button
                type="button"
                disabled={promoCodeValue === ""}
                onClick={applyPromoCode}
              >
                Apply
              </button>

              {error && <span className="error">Invalid promo code</span>}
            </form>
          </div>
        </div>

        <div className="sidebar__foot">
          <div
            className={`sidebar__foot-title ${isCartOpen ? "is-active" : ""}`}
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <h3>
              Your cart <span className="gray">{`(${products.length})`}</span>
            </h3>

            <button type="button">
              <svg
                width="14"
                height="9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="m12.47.47 1.06 1.06L7 8.06.47 1.53 1.53.47 7 5.94 12.47.47Z"
                  fill="#666"
                ></path>
              </svg>
            </button>
          </div>

          <div
            className="section__foot-content"
            style={{ height: `${sectionCartHeight}px` }}
          >
            <div className="products" ref={cartRef}>
              {products.map((product) => (
                <div className="product" key={product.id}>
                  <div className="product__image">
                    <img src={product.imageUrl} alt="" />
                  </div>

                  <div className="product__content">
                    <h5>{product.type}</h5>
                    <p>{product.name}</p>
                    <span>Colour: {product.color}</span>
                    <span>Size: {product.size}</span>
                    Qty: <span>Qty: {product.color}</span>
                    <b>
                      {product.currency}
                      {product.price.toFixed(2).replace(".", ",")}
                    </b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {location.pathname === "/payment" && (
          <DeliveryDetails details={formData} deliveryMethod={deliveryInfo} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
