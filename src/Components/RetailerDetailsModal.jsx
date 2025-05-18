import { useEffect, useState } from "react";
import axios from "axios";

const RetailerDetailsModal = ({ showModal, setShowModal, retailer }) => {
  const [retailerDetails, setRetailerDetails] = useState(null);

  useEffect(() => {
    if (retailer && showModal) {
      axios
        .get(`https://ahadinash07-e-shop-backend2-for-admin-retailer.vercel.app/retailers/${retailer.retailerId}`)
        .then((response) => {
          setRetailerDetails(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching retailer details:", error);
        });
    }
  }, [retailer, showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Retailer Details</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {retailerDetails ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Retailer ID
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {retailerDetails.retailerId}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {retailerDetails.Retailer_Name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {retailerDetails.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      retailerDetails.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {retailerDetails.status}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Registered At
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(retailerDetails.Registered_at).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading retailer details...</p>
        )}
      </div>
    </div>
  );
};

export default RetailerDetailsModal;