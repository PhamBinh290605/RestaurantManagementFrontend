// src/pages/admin/order/index.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TableSelectionPage from './pages/TableSelectionPage';
import OrderDetailPage from './pages/OrderDetail';

const OrderFeature = () => {
  return (
    <Routes>
      {/* Route for selecting a table */}
      <Route path="select-table" element={<TableSelectionPage />} />

      {/* Route for viewing and editing a specific order */}
      <Route path="details/:orderId" element={<OrderDetailPage />} />

      {/* Optional: A default route if someone navigates to just /order */}
      <Route index element={<TableSelectionPage />} />
    </Routes>
  );
};

export default OrderFeature;