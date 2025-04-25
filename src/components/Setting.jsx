import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hook/useAuthContext";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const Setting = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setUserData] = useState({
    id: user?.id || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    userName: user?.userName || "",
    imageUrl: user?.imageUrl || "",
    email: user?.email || "",
    bio: user?.bio || "", // TODO: Currently dun have this in the backend
  });

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
    }
  }, [user]);
  // console.log(userData);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({
          ...userData,
          profileImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      // Replace with your actual API endpoint
      const response = await axios.put(
        "https://blog-backend-a3p6.onrender.com/api/user/settings",
        userData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setSuccessMessage("Personal information updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      // Replace with your actual API endpoint
      const response = await axios.put(
        "https://blog-backend-a3p6.onrender.com/api/user/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
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
      setSaving(false);
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
                  {userData.imageUrl ? (
                    <div className="relative">
                      <img
                        src={userData.imageUrl}
                        alt="Profile"
                        className="profile_image w-32 h-32 object-cover border-2 border-black"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setUserData({ ...userData, imageUrl: "" })
                        }
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="image-upload">
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
                    <label htmlFor="name" className="startup-form_label">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handlePersonalInfoChange}
                      placeholder="Your name"
                      className="startup-form_input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className="startup-form_label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handlePersonalInfoChange}
                      placeholder="Your name"
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
                <label htmlFor="bio" className="startup-form_label">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={userData.bio}
                  onChange={handlePersonalInfoChange}
                  placeholder="Tell us about yourself"
                  className="startup-form_textarea w-full min-h-[120px]"
                />
              </div>

              <div className="flex justify-end items-center mt-8">
                <button
                  type="submit"
                  className="startup-form_btn bg-my-primary hover:bg-my-primary-100 transition-colors"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
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
                  className="startup-form_btn bg-my-primary hover:bg-my-primary-100 transition-colors"
                  disabled={saving}
                >
                  {saving ? "Updating..." : "Update Password"}
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
