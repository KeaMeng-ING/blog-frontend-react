import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hook/useAuthContext";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const Setting = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setUserData] = useState({
    id: user?.id || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    userName: user?.userName || "",
    imageUrl: user?.imageUrl || "",
    email: user?.email || "",
    bioProfile: user?.bioProfile || "", // TODO: Currently dun have this in the backend
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  console.log(user);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        ...user,
      }));
      // Set initial imagePreview if user has an imageUrl
      if (user.imageUrl) {
        setImagePreview(user.imageUrl);
      }
    }
  }, [user]);

  const handlePersonalInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  // Function to handle removing the current image
  const handleRemoveImage = () => {
    setUserData({ ...userData, imageUrl: "" });
    setImage(null);
    setImagePreview(null);
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      // Create a copy of userData that we'll update and send
      const updatedUserData = { ...userData };

      // Process the image if there's a new one
      if (image) {
        try {
          const imageData = await toBase64(image);
          console.log("Image converted to base64 successfully");
          // Update the userData copy with the new image
          updatedUserData.imageUrl = imageData;
          console.log(imageData);
        } catch (imgError) {
          console.error("Error converting image:", imgError);
          setError(
            "Failed to process the image. Please try a different image."
          );
          setLoading(false);
          return;
        }
      }

      console.log(updatedUserData);

      // Replace with your actual API endpoint
      const response = await axios.put(
        "http://localhost:8080/api/users/settings",
        updatedUserData
      );

      console.log(response);

      // Update the local state with the updated data
      setUserData(updatedUserData);

      setSuccessMessage("Personal information updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      // Update in authContext
      const newUser = {
        ...user,
        firstName: updatedUserData.firstName,
        lastName: updatedUserData.lastName,
        userName: updatedUserData.userName,
        imageUrl: updatedUserData.imageUrl,
        bioProfile: updatedUserData.bioProfile,
      };
      setUser(newUser);

      // Update localStorage to persist changes
      localStorage.setItem("user", JSON.stringify(newUser));

      navigate("/profile/" + updatedUserData.userName);
    } catch (error) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings. Please try again.");
      if (error.response?.data === "Forbidden") {
        console.log("in forbidden");
        logout(); //TODO: To be updated with message
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      setLoading(true);

      // Replace with your actual API endpoint
      // eslint-disable-next-line no-unused-vars
      const response = await axios.put(
        "http://localhost:8080/api/users/change-password",
        {
          id: user.id,
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }
      );

      setSuccessMessage("Password updated successfully!");
      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating password:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section_container min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="section_container min-h-screen">
      <h1 className="text-30-bold mb-8">Account Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Navbar */}
        <div className="w-full md:w-64 profile-startup-card">
          <nav className="flex flex-col gap-2">
            <button
              className={`py-3 px-4 text-left rounded-lg transition duration-200 font-medium ${
                activeTab === "personal"
                  ? "bg-my-primary text-white"
                  : "hover:bg-my-primary-100"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Information
            </button>
            <button
              className={`py-3 px-4 text-left rounded-lg transition duration-200 font-medium ${
                activeTab === "password"
                  ? "bg-my-primary text-white"
                  : "hover:bg-my-primary-100"
              }`}
              onClick={() => setActiveTab("password")}
            >
              Change Password
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 profile-startup-card">
          {error && <ErrorMessage error={error} />}

          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
              {successMessage}
            </div>
          )}

          {activeTab === "personal" ? (
            <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
              <div className="flex-col">
                <label className="startup-form_label">Profile Picture</label>
                <div className="mt-3 flex items-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="profile_image w-32 h-32 object-cover border-2 border-black"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="image-upload cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <div className="flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span>Upload Image</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div className="flex-col">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="startup-form_label">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handlePersonalInfoChange}
                      placeholder="Your first name"
                      className="startup-form_input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="startup-form_label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handlePersonalInfoChange}
                      placeholder="Your last name"
                      className="startup-form_input w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex-col">
                <label htmlFor="email" className="startup-form_label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handlePersonalInfoChange}
                  placeholder="your.email@example.com"
                  className="startup-form_input w-full"
                  required
                  disabled
                />
                <p className="text-16-medium mt-1 text-gray-500">
                  Email cannot be changed
                </p>
              </div>

              <div className="flex-col">
                <label htmlFor="bioProfile" className="startup-form_label">
                  Bio
                </label>
                <textarea
                  id="bioProfile"
                  name="bioProfile"
                  value={userData.bioProfile}
                  onChange={handlePersonalInfoChange}
                  placeholder="Tell us about yourself"
                  className="startup-form_textarea w-full min-h-[120px]"
                />
              </div>

              <div className="flex justify-end items-center mt-8">
                <button
                  type="submit"
                  className="startup-form_btn bg-my-primary hover:bg-my-primary-100 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="flex-col">
                <label htmlFor="currentPassword" className="startup-form_label">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  className="startup-form_input w-full"
                  required
                />
              </div>

              <div className="flex-col">
                <label htmlFor="newPassword" className="startup-form_label">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  className="startup-form_input w-full"
                  required
                  minLength={8}
                />
                <p className="text-16-medium mt-1 text-gray-500">
                  Password must be at least 8 characters
                </p>
              </div>

              <div className="flex-col">
                <label htmlFor="confirmPassword" className="startup-form_label">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  className="startup-form_input w-full"
                  required
                  minLength={8}
                />
              </div>

              <div className="flex justify-end items-center mt-8">
                <button
                  type="submit"
                  className="startup-form_btn text-white bg-my-primary hover:bg-my-primary-100 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;
