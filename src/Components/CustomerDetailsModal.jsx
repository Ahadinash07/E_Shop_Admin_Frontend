import { useEffect, useState } from "react";
import axios from "axios";

const CustomerDetailsModal = ({ showModal, setShowModal, user }) => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (user && showModal) {
      axios
        .get(`https://ahadinash07-e-shop-backend2-for-admin-retailer.vercel.app/users/${user.user_id}`)
        .then((response) => {
          setUserDetails(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [user, showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">User Details</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {userDetails ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  User ID
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {userDetails.user_id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {userDetails.first_name} {userDetails.last_name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Username
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {userDetails.username}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {userDetails.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Phone
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {userDetails.phone}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      userDetails.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {userDetails.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {userDetails.address}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  City
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {userDetails.city}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  State
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {userDetails.state}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Country
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {userDetails.country}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Created At
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(userDetails.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailsModal;