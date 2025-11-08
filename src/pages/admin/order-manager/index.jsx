import { useEffect, useState } from "react";
import api from "../../../../api";

const OrderManagerPage = () => {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);


  const getData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      const data = response.data;
      setOrderData(data.result);
      console.log(data.result);
    } catch (error) {
      console.error('Error fetching order data:', error);
      toast.error('Failed to fetch order data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-3">Order Management</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orderData.length > 0 ? (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Status</th>
              <th>Total Amount</th>
              <th>Order Type</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {orderData.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userName}</td>
                <td>{order.status}</td>
                <td>{order.totalAmount.toLocaleString()} ₫</td>
                <td>{order.orderType}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderManagerPage;