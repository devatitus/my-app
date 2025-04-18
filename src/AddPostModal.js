import React, { useState, useEffect } from "react";
import "./AddPostModal.css";

const AddPostModal = ({ isOpen, onClose, onAddPost, editingPost }) => {
  const [postName, setPostName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [selectedTime, setSelectedTime] = useState("breakfast");
  const [customTimeName, setCustomTimeName] = useState("");
  const [customStartTime, setCustomStartTime] = useState("06:00");
  const [customEndTime, setCustomEndTime] = useState("12:00");

  useEffect(() => {
    if (isOpen) {
      if (editingPost && typeof editingPost === "object") {
        setPostName(editingPost.name || "");
        setPrice(editingPost.price || "");
        setImage(editingPost.image || null);

        if (editingPost.customTimeName) {
          setSelectedTime("custom");
          setCustomTimeName(editingPost.customTimeName || "");
          setCustomStartTime(editingPost.customStartTime || "06:00");
          setCustomEndTime(editingPost.customEndTime || "12:00");
        } else if (editingPost.timing) {
          const lowerTiming = editingPost.timing.toLowerCase();
          if (lowerTiming.includes("breakfast")) setSelectedTime("breakfast");
          else if (lowerTiming.includes("lunch")) setSelectedTime("lunch");
          else if (lowerTiming.includes("dinner")) setSelectedTime("dinner");
          else setSelectedTime("custom");
        } else {
          setSelectedTime("noTiming");
        }
      } else {
        // Reset for add mode
        setPostName("");
        setPrice("");
        setImage(null);
        setSelectedTime("breakfast");
        setCustomTimeName("");
        setCustomStartTime("06:00");
        setCustomEndTime("12:00");
      }
    }
  }, [editingPost, isOpen]); // 👈 Add isOpen here

  const timeSlots = {
    breakfast: { name: "Breakfast", start: "06:30", end: "10:30" },
    lunch: { name: "Lunch", start: "12:00", end: "15:30" },
    dinner: { name: "Dinner", start: "19:00", end: "00:00" },
    custom: { name: customTimeName, start: customStartTime, end: customEndTime },
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // ✅ sets base64 image string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTimeChange = (event) => {
    const selected = event.target.value;
    setSelectedTime(selected);

    if (selected !== "custom") {
      setCustomTimeName("");
      setCustomStartTime(timeSlots[selected]?.start || "06:00");
      setCustomEndTime(timeSlots[selected]?.end || "12:00");
    }
  };

  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    let period = "AM";

    hours = parseInt(hours);
    if (hours >= 12) {
      period = "PM";
      if (hours > 12) hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
  };

  const handleSavePost = () => {
    if (!postName || !price || !image) {
      alert("Please enter all details");
      return;
    }

    const postData = {
      name: postName,
      price: price,
      image: image,
    };

    if (selectedTime !== "noTiming") {
      const formattedStartTime = convertTo12HourFormat(customStartTime);
      const formattedEndTime = convertTo12HourFormat(customEndTime);

      postData.timing =
        selectedTime === "custom"
          ? `${customTimeName} (${formattedStartTime} - ${formattedEndTime})`
          : `${timeSlots[selectedTime].name} (${convertTo12HourFormat(timeSlots[selectedTime].start)} - ${convertTo12HourFormat(timeSlots[selectedTime].end)})`;

      postData.customTimeName = selectedTime === "custom" ? customTimeName : null;
      postData.customStartTime = selectedTime === "custom" ? customStartTime : null;
      postData.customEndTime = selectedTime === "custom" ? customEndTime : null;
    }

    onAddPost(postData);
    onClose();
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editingPost ? "Edit Post" : "Create Post"}</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Name"
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="image-uploads">
          <label className="image-boxs">
            {image ? (
              <img src={image} alt="Post Preview" className="preview-images" />
            ) : (
              <span>+</span>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>
        </div>

        <div className="timing-section">
          <label>Timing</label>
          <select onChange={handleTimeChange} value={selectedTime}>
            <option value="noTiming">No Timing</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="custom">Custom Timing</option>
          </select>

          {selectedTime === "custom" && (
            <div className="custom-time">
              <input
                type="text"
                placeholder="Enter custom timing name (e.g., Evening Snacks)"
                value={customTimeName}
                onChange={(e) => setCustomTimeName(e.target.value)}
              />
              <input
                type="time"
                value={customStartTime}
                onChange={(e) => setCustomStartTime(e.target.value)}
              />
              <span>to</span>
              <input
                type="time"
                value={customEndTime}
                onChange={(e) => setCustomEndTime(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSavePost}>
            {editingPost ? "Update Post" : "Save Post"}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddPostModal;
