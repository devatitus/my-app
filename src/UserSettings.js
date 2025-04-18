import React, { useState, useEffect } from "react";
import "./UserSettings.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./assets/logo.webp";
import {
  getCurrentUser,
  getCurrentUserKey,
  updateCurrentUser
} from "./users";

// Converts lat/lng to Degrees Minutes Seconds (DMS)
const convertToDMS = (lat, lng) => {
  const toDMS = (deg, isLat) => {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = (((absolute - degrees) * 60 - minutes) * 60).toFixed(1);
    const direction = deg >= 0 ? (isLat ? "N" : "E") : (isLat ? "S" : "W");
    return `${degrees}°${String(minutes).padStart(2, '0')}'${String(seconds).padStart(4, '0')}"${direction}`;
  };
  return `${toDMS(lat, true)} ${toDMS(lng, false)}`;
};

// Convert AM/PM to 24hr
const convertTo24Hour = (timeStr) => {
  if (!timeStr) return "";
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

// Convert 24hr to AM/PM
const convertToAMPM = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = parseInt(hour);
  const suffix = h >= 12 ? "PM" : "AM";
  const adjustedHour = ((h + 11) % 12) + 1;
  return `${adjustedHour}:${minute} ${suffix}`;
};

const Settings = () => {
  const [profileImage, setProfileImage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [userName, setUserName] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [userLocation, setUserLocation] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const isRegisterMode = location.pathname === "/register";

  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) {
      setProfileImage(userData.profile || "");
      setBackgroundImage(userData.background || "");
      setUserName(userData.username || "");
      setUserLocation(userData.location || "");

      if (userData.availability) {
        const [openAMPM = "", closeAMPM = ""] = userData.availability.split(" - ");
        setOpeningTime(convertTo24Hour(openAMPM));
        setClosingTime(convertTo24Hour(closeAMPM));
      }
    }
  }, []);

  const handleSave = () => {
    const availability = `${convertToAMPM(openingTime)} - ${convertToAMPM(closingTime)}`;

    updateCurrentUser({
      profile: profileImage,
      background: backgroundImage,
      username: userName,
      availability,
      location: userLocation
    });

    navigate("/profile");
  };

  const handleCancel = () => {
    if (isRegisterMode) {
      alert("You must register to proceed.");
    } else {
      navigate("/profile");
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBackgroundImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAutoDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const coords = convertToDMS(lat, lng);
          setUserLocation(coords);
          alert("Location auto-filled");
        },
        () => alert("Unable to access your location.")
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-border">
        <img src={logo} alt="My Menu Logo" className="logo" />
        <h2>{isRegisterMode ? "USER REGISTRATION" : "UPDATE PROFILE"}</h2>

        <label><strong>Profile Image</strong></label>
        <div className="image-uploads">
          <label className="image-boxs">
            {profileImage ? <img src={profileImage} alt="Profile" className="preview-images" /> : <span>+</span>}
            <input type="file" accept="image/*" onChange={handleProfileImageUpload} hidden />
          </label>
        </div>

        <label><strong>Background Image</strong></label>
        <div className="image-uploads">
          <label className="image-boxs">
            {backgroundImage ? <img src={backgroundImage} alt="Background" className="preview-images" /> : <span>+</span>}
            <input type="file" accept="image/*" onChange={handleBackgroundImageUpload} hidden />
          </label>
        </div>

        <label><strong>User Name</strong></label>
        <div className="post-header-name">
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
        </div>

        <label><strong>Timing</strong></label>
        <div className="hoteltiming" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input type="time" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} />
          <span>to</span>
          <input type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} />
        </div>

        <label><strong>Location Coordinates</strong></label>
        <div className="location">
          <input
            type="text"
            value={userLocation}
            onChange={(e) => setUserLocation(e.target.value)}
            placeholder="enter the coordinate"
            className="mt-2 mb-4 p-2 rounded-md border w-full"
          />
          <button className="save-btn" onClick={handleAutoDetectLocation}>Auto</button>
        </div>

        <div className="settings-buttons">
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>
            {isRegisterMode ? "OK" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
