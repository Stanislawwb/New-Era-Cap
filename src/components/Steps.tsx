import React from "react";
import { useLocation } from "react-router-dom";

const Steps: React.FC = () => {
  const location = useLocation();

  const handleStepOne = (): React.ReactNode => {
    if (location.pathname === "/login") {
      return "1";
    } else {
      return <i className="material-icons">check</i>;
    }
  };

  const handleStepTwo = (): React.ReactNode => {
    if (
      location.pathname === "/information" ||
      location.pathname === "/login"
    ) {
      return "2";
    } else {
      return <i className="material-icons">check</i>;
    }
  };

  return (
    <div className="steps">
      <div className="shell">
        <ul>
          <li>
            <span
              className={`${
                location.pathname === "/login" ? "is-active" : ""
              } ${location.pathname !== "/login" ? "is-checked" : ""}`}
            >
              {handleStepOne()}
            </span>
            Login
          </li>

          <li>
            <span
              className={`${
                location.pathname === "/information" ? "is-active" : ""
              } ${location.pathname === "/payment" ? "is-checked" : ""}`}
            >
              {handleStepTwo()}
            </span>
            Information
          </li>

          <li>
            <span
              className={location.pathname === "/payment" ? "is-active" : ""}
            >
              3
            </span>
            Payment
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Steps;
