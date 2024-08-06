const DeliveryDetails = ({ details, deliveryMethod }) => {
  return (
    <div className="sidebar__details">
      <h3>Delivery Details</h3>

      <p>
        {details.firstName} {details.lastName}
      </p>

      <p>
        {details.address}, {details.city}, {details.state}, {details.postcode},{" "}
        {details.country}{" "}
      </p>

      <p>{details.tel}</p>

      <p>{details.email}</p>

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
  );
};

export default DeliveryDetails;
