const DeliveryDetails = ({ details, deliveryMethod }) => {
  return (
    <div className="sidebar__delivery-info">
      <div className="sidebar__delivery-details">
        <h3>Delivery Details</h3>

        <p>
          {details.firstName && details.lastName && (
            <>
              {details.firstName} {details.lastName}
            </>
          )}
        </p>

        <p>
          {details.address && `${details.address}, `}
          {details.city && `${details.city}, `}
          {details.state && `${details.state}, `}
          {details.postcode && `${details.postcode}, `}
          {details.country && `${details.country}`}
        </p>

        {details.tel && <p>{details.tel}</p>}
        {details.email && <p>{details.email}</p>}
      </div>

      <div className="sidebar__delivery-method">
        <h3>Delivery Method</h3>

        {deliveryMethod.method === "standard" ? (
          <>
            <p>Standard (3-6 working days)</p>
            <p>Standard</p>
          </>
        ) : (
          <>
            <p>Delivery within 1 to 2 working days.</p>
            <p>Express</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DeliveryDetails;
