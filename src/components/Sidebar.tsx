import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DeliveryDetails from "./DeliveryDetails";
import useSectionHeight from "../helpers/useSectionHeight";
import usePromoCode from "../helpers/usePromoCode";
import { FormData, PromoCode } from "../types/detailsFormTypes";
import { getSession, updateSession, createSession, getSessionById, getSessionId } from "../http/sessionService";
import { SessionData } from "../http/sessionService";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import { useDispatch } from "react-redux";
import { removeFromCart, decreaseQuantity, increaseQuantity } from "../state/cart/cartSlice";

interface DeliveryInfo {
  method: string;
  price: number;
}

interface SidebarProps {
  delivery: DeliveryInfo;
  setAppliedPromoCode?: (appliedPromoCode: PromoCode) => void;
  setParentTotal?: (total: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ delivery, setAppliedPromoCode, setParentTotal }) => {
  const cartItems  = useSelector((state: RootState) => state.cart.cartItems);
  const dispatch = useDispatch<AppDispatch>();
  const productsInCartCount =  cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigate = useNavigate();

  const [error, setError] = useState<boolean>(false);
  const [total, setTotal] = useState<string>("0");
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({ method: "", price: 0 });
  const [formData, setFormData] = useState<FormData | null>(null);

  const [promoCode, setPromoCode] = useState<PromoCode>({
    name: null,
    amount: 0,
    value: "",
    discount: 0,
  });

  const { applyPromoCode, removePromoCode } = usePromoCode(({ name, amount, total }) => {
    setPromoCode((prev) => ({ ...prev, name, amount }));
    setTotal(total);
  });

  const location = useLocation();

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const sessionData = await getSession();
        
        if (sessionData) {
          setFormData(sessionData.formData);
          setPromoCode((prev) => ({
            ...prev,
            name: sessionData.codeName || null,
            amount: sessionData.discountAmount || 0
          }));

          if (sessionData.formData && sessionData.formData.delivery) {
            setDeliveryInfo({
              method: sessionData.formData.delivery.method,
              price: sessionData.formData.delivery.price
            });
          }
        }
      } catch (error) {
        console.error("Failed to load session data", error);
      }
    };

    loadSessionData();
  }, []);

  useEffect(() => {
    const saveSessionData = async () => {
      try {
        if (formData) {
          const existingSession = await getSessionById(getSessionId());
          const sessionData: SessionData = {
            sessionId: getSessionId(),
            formData,
            codeName: promoCode.name || undefined,
            discountAmount: promoCode.amount || undefined
          };
          
          if (existingSession) {
            await updateSession({ ...existingSession, ...sessionData });
          } else {
            await createSession(sessionData);
          }
        }
      } catch (error) {
        console.error("Failed to save session data", error);
      }
    };
    
    saveSessionData();
  }, [formData, promoCode]);
  
  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);  

  useEffect(() => {
    let finalTotal = subTotal;

    if (finalTotal < 50) {
      finalTotal += delivery.price;
    }

    finalTotal -= promoCode.amount;

    setTotal(finalTotal.toFixed(2));

    if (setParentTotal && finalTotal !== undefined) {
      setParentTotal(finalTotal);
    }
  }, [subTotal, delivery, promoCode.amount]);

  const handlePromoCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const code = event.target.value;
    setPromoCode((prev) => ({...prev, value: code}));
  };

  const handleApplyPromoCode = async () => {
    const promoCodeResponse = await applyPromoCode(promoCode.value, subTotal);
  
    if (promoCodeResponse) {
      const { name, amount, discount } = promoCodeResponse;
  
      setPromoCode({
          name: name,
          amount: amount,
          value: promoCode.value,
          discount: discount,
      });

      if (setAppliedPromoCode) {
        setAppliedPromoCode({
          name: name,
          amount: amount,
          value: promoCode.value,  
          discount: discount,        
        });
      }
      
      setError(false);
    } else {
      setError(true);
      setPromoCode((prev) => ({
        ...prev,
        name: null,
        amount: 0
      }));
    }
  };

  const handleRemovePromoCode = () => {
    removePromoCode(subTotal);

    setPromoCode({
      name: null,
      amount: 0,
      value: "",
      discount: 0,
    })

    setError(false);
    
    const finalTotal = subTotal < 50 ? subTotal + delivery.price : subTotal;
    setTotal(finalTotal.toFixed(2));
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

          <div className="sidebar__subtotal sidebar__row">
            <p>
              Subtotal{" "}
              <span>
                ({productsInCartCount} {productsInCartCount > 1 ? "items" : "item"})
              </span>
            </p>

            <span>€{subTotal.toFixed(2)}</span>
          </div>

          {promoCode.name && promoCode.amount > 0 && (
            <div className="sidebar__row">
              <p>
                Promo Code:{" "}
                <span style={{ fontWeight: 700, fontSize: "14px" }}>
                  ({promoCode.name})
                </span>
              </p>

              <span>-€ {promoCode.amount.toFixed(2)}</span>
            </div>
          )}

          {subTotal >= 50 && (
            <div className="sidebar_shipping sidebar__row">
              <p>Free Shipping over 40GBP/50EUR</p>

              <span>-€ {delivery.price.toFixed(2).replace(",", ".")}</span>
            </div>
          )}

          <div className="sidebar__delivery sidebar__row">
            <p>Delivery</p>

            <span>
              {subTotal >= 50
                ? "Free"
                : "€" + delivery.price.toFixed(2).replace(",", ".")}
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
                  value={promoCode.value}
                  onChange={handlePromoCode}
                />
                <button
                  type="button"
                  disabled={promoCode.value === ""}
                  onClick={handleApplyPromoCode}
                >
                  Apply
                </button>
                {error && <span className="error">Invalid promo code</span>}
              </form>

              {promoCode.name && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <div>
                    APPLIED: <strong>{promoCode.name}</strong>
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
              Your cart <span className="gray">{`(${cartItems.length})`}</span>
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
              {cartItems.map((item) => (
                <div className="product" key={item.product.id}>
                  <div className="product__image">
                    <img src={item.product.imageUrl} alt="" />
                  </div>

                  <div className="product__content">
                    <h5>{item.product.type}</h5>
                    <p>{item.product.name}</p>                    

                    <b>
                      {item.product.currency}
                      {item.product.price.toFixed(2).replace(".", ",")}
                    </b>

                    {location.pathname === "/checkout" && (
                      <div className="product__actions">
                        <div className="product__quantity">
                          <button onClick={() => dispatch(decreaseQuantity(item.product))} className="product__quantity-item">-</button>

                          <span className="product__quantity-item">{item.quantity}</span>

                          <button onClick={() => dispatch(increaseQuantity(item.product))} className="product__quantity-item">+</button>
                        </div>

                        <button 
                          onClick={() => {
                            dispatch(removeFromCart(item.product));
                            
                            if(productsInCartCount === 1) {
                              navigate('/');
                            }
                          }} className="product__remove">Remove</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {location.pathname === "/payment" && formData  && (
          <DeliveryDetails details={formData} deliveryMethod={deliveryInfo} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
