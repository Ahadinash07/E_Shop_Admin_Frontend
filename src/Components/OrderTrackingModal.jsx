import { useState, useEffect } from "react";
import axios from "axios";

const OrderTrackingModal = ({ showModal, setShowModal, order }) => {
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (order && showModal) {
      setLoading(true);
      axios
        .get(`https://ahadinash07-e-shop-backend2-for-admin-retailer.vercel.app/orders/${order.order_id}/tracking`)
        .then((response) => {
          setTrackingHistory(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching tracking history:", error);
          setLoading(false);
        });
    }
  }, [order, showModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`https://ahadinash07-e-shop-backend2-for-admin-retailer.vercel.app/orders/${order.order_id}/tracking`, {
        status,
        notes,
      })
      .then(() => {
        // Refresh tracking history
        axios
          .get(`https://ahadinash07-e-shop-backend2-for-admin-retailer.vercel.app/orders/${order.order_id}/tracking`)
          .then((response) => {
            setTrackingHistory(response.data.data);
            setStatus("");
            setNotes("");
          });
      })
      .catch((error) => {
        console.error("Error updating tracking:", error);
      });
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Order Tracking</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Order Details</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.order_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">
                {order.first_name} {order.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">${order.total_amount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Status</p>
              <p className="font-medium">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.order_status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.order_status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.order_status}
                </span>
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">Products</h3>
          <div className="space-y-2 mb-4">
            {order.products.map((product, index) => (
              <div key={index} className="border p-2 rounded">
                <p>Product ID: {product.product_id}</p>
                <p>Quantity: {product.quantity}</p>
                <p>Price: ₹{product.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Update Tracking</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded"
                rows="3"
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Tracking
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Tracking History</h3>
          {loading ? (
            <p>Loading tracking history...</p>
          ) : trackingHistory.length === 0 ? (
            <p>No tracking history available.</p>
          ) : (
            <div className="space-y-4">
              {trackingHistory.map((tracking, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <div className="flex justify-between">
                    <p className="font-medium">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          tracking.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : tracking.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {tracking.status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(tracking.update_time).toLocaleString()}
                    </p>
                  </div>
                  {tracking.notes && (
                    <p className="mt-1 text-sm text-gray-700">
                      Notes: {tracking.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;