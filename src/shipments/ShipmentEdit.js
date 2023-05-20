import { useState, useEffect } from "react";
import { AfterShip } from "aftership";
//const { AFTERSHIP_API_KEY } = require('../config');

export const ShipmentEdit = ({ trackingNumber }) => {
  const [shipment, setShipment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Haetaan lähetyksen tiedot omasta API:stä
      const response = await fetch(`/api/shipments/${trackingNumber}/`);
      const shipmentData = await response.json();

      // Haetaan lähetyksen tila Aftershipin kautta
      const aftershipAPI = new AfterShip(process.env.AFTERSHIP_API_KEY);
      const tracking = await aftershipAPI.tracking.get(shipmentData.courier, shipmentData.trackingNumber);

      // Asetetaan lähetyksen tila tilaan
      setShipment({
        ...shipmentData,
        tracking: tracking.data.tracking,
      });
    };

    fetchData();
  }, [trackingNumber]);

  if (!shipment) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Shipment Details</h2>
      <p>Order Number: {shipment.orderNumber}</p>
      <p>Package Count: {shipment.packageCount}</p>
      <p>Courier: {shipment.courier}</p>
      <p>Tracking Number: {shipment.trackingNumber}</p>
      {shipment.tracking && (
        <div>
          <h3>Tracking Details</h3>
          <p>Tracking Number: {shipment.tracking.tracking_number}</p>
          <p>Status: {shipment.tracking.tag}</p>
          <p>Location: {shipment.tracking.checkpoints[0].location}</p>
          <p>Time: {shipment.tracking.checkpoints[0].checkpoint_time}</p>
        </div>
      )}
    </div>
  );
};
