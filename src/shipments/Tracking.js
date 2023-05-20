// src/shipments/Tracking.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tracking = ({ trackingNumber }) => {
  const [trackingData, setTrackingData] = useState(null);

  useEffect(() => {
    if (!trackingNumber) {
      return;
    }
  
    async function fetchData() {
      const data = await fetchTrackingData(trackingNumber, 'COURIER_NAME');
      setTrackingData(data);
    }
  
    fetchData();
  }, [trackingNumber]);
  
  

  if (!trackingData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Tracking Details</h2>
      {/* Render tracking data here */}
    </div>
  );
};

async function fetchTrackingData(trackingNumber, courier) {
  try {
    const response = await axios.get(`/tracking/${courier}/${trackingNumber}`);
    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("Error fetching tracking data:", err.response.data);
    } else {
      console.error("Error fetching tracking data:", err.message);
    }
    return null;
  }
}

export default Tracking;
