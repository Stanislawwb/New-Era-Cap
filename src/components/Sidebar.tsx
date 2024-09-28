import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useLocation } from "react-router-dom";
import DeliveryDetails from "./DeliveryDetails";
import useSectionHeight from "../helpers/useSectionHeight";
import useFetchProducts, { Product } from "../helpers/useFetchProducts";
import usePromoCode from "../helpers/usePromoCode";
import { FormData } from "./DetailsForm";

interface DeliveryInfo {
  method: string;
  price: number;
}

const Sidebar: React.FC = () => {
  const { products, loading } = useFetchProducts();

  const [error, setError] = useState<boolean>(false);

  const { applyPromoCode, removePromoCode } = usePromoCode();

  const [subTotal, setSubTotal] = useState<number>(
    parseFloat(sessionStorage.getItem("subTotal") || "0")
  );
  const [promoCodeValue, setPromoCodeValue] = useState<string>(
    sessionStorage.getItem("promoCode") || ""
  );

  const [total, setTotal] = useState(sessionStorage.getItem("total") || 0);

  const location = useLocation();

  const formData: FormData = JSON.parse(sessionStorage.getItem("formData") || '{}');
  const deliveryInfo: DeliveryInfo = JSON.parse(sessionStorage.getItem("deliveryInfo") || '{"price": 0 }');

  const codeName = sessionStorage.getItem("codeName");
  const codeAmount = Number(sessionStorage.getItem("codeAmount")).toFixed(2);

  useEffect(() => {
    let finalTotal = products
      .reduce((acc, product) => acc + product.price, 0)
      .toFixed(2);

    setSubTotal(parseFloat(finalTotal));
  }, [products]);

  useEffect(() => {
    let finalTotal = subTotal;

    if (finalTotal < 50) {
      finalTotal += deliveryInfo.price;
    }

    const discount = sessionStorage.getItem("codeAmount")
      ? parseFloat(sessionStorage.getItem("codeAmount") || '0') : 0;

    finalTotal -= discount;

    setTotal(finalTotal.toFixed(2));
    sessionStorage.setItem("total", finalTotal.toFixed(2));
  }, [subTotal, deliveryInfo]);

  const handlePromoCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const code = event.target.value;

    setPromoCodeValue(code);
  };

  const handleApplyPromoCode = async () => {
    const isPromoApplied = await applyPromoCode(promoCodeValue, subTotal);

    setError(!isPromoApplied);

    const updatedTotal = parseFloat(sessionStorage.getItem("total") || '0');

    if (updatedTotal > 0) {
      setTotal(updatedTotal);
    }
  };

  const handleRemovePromoCode = () => {
    removePromoCode(subTotal);

    setPromoCodeValue("");
    setError(false);

    const subTotalWithoutDiscount = subTotal;

    let finalTotal = subTotalWithoutDiscount;

    setTotal(finalTotal.toFixed(2));

    sessionStorage.setItem("total", finalTotal.toFixed(2));
  };

  // Accordions Height
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [isPromoCodeOpen, setIsPromoCodeOpen] = useState(true);

  const { sectionHeight: sectionCartHeight, sectionRef: cartRef } =
    useSectionHeight(isCartOpen);
  const { sectionHeight: promoCodeHeight, sectionRef: promoCodeRef } =
    useSectionHeight(isPromoCodeOpen);

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

            <span>€{subTotal.toFixed(2)}</span>
          </div>

          {codeName && parseFloat(codeAmount) > 0 && (
            <div className="sidebar__row">
              <p>
                Promo Code:{" "}
                <span style={{ fontWeight: 700, fontSize: "14px" }}>
                  ({codeName})
                </span>
              </p>

              <span>-€ {codeAmount}</span>
            </div>
          )}

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
            <div ref={promoCodeRef}>
              <form action="">
                <input
                  type="text"
                  placeholder="Enter Promo"
                  value={promoCodeValue}
                  onChange={handlePromoCode}
                />
                <button
                  type="button"
                  disabled={promoCodeValue === ""}
                  onClick={handleApplyPromoCode}
                >
                  Apply
                </button>
                {error && <span className="error">Invalid promo code</span>}
              </form>

              {codeName && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <div>
                    APPLIED: <strong>{codeName}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemovePromoCode}
                    style={{
                      backgroundColor: "#ff4d4f",
                      color: "#fff",
                      border: "none",
                      padding: "4px 18px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      marginLeft: "10px",
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
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
