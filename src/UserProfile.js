import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UserProfile.css";

const CustomerProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const userData = users[username];
    const userPosts = JSON.parse(localStorage.getItem(`${username}_posts`)) || [];

    if (!userData) {
      alert("User not found.");
      navigate("/");
    } else {
      setUser(userData);
      setPosts(userPosts);
    }
  }, [username, navigate]);

  const getStartMinutes = (timingStr) => {
    if (!timingStr) return 9999;
    const match = timingStr.match(/(\d{1,2}):(\d{2}) (AM|PM)/i);
    if (!match) return 9999;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  return (
    <div className="user-container">
      {/* Background and profile image */}
      <img src={user.background || "https://placehold.co/600x300"} alt="Background" className="user-background" />

      <div className="profile-container">
        <img src={user.profile || "https://placehold.co/120x120"} alt="Profile" className="user-profile" />
      </div>

      {/* User info */}
      <div className="user-info">
        <h1 className="user-name">{user.username || "Profile Name"}</h1>
        <p className="user-availability">{user.availability || "10:00 AM - 12:00 PM"}</p>
      </div>

      {/* Menu title */}
      <div className="button-container">
        <div className="m1"><h1> MENU </h1></div>
      </div>

      {/* Search box */}
      <div className="search-container">
        <input
          type="text"
          className="post-search"
          placeholder="Search by post name or timing..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Menu items (posts) */}
      {[...posts]
        .filter((post) =>
          (post.name && post.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (post.timing && post.timing.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => getStartMinutes(a.timing) - getStartMinutes(b.timing))
        .map((post) => (
          <div key={post.id} className="post-post">
            <img src={post.image} alt={post.name} className="post-image" />
            <div className="post-details">
              <div className="post-header">
                <input type="text" value={post.name} className="post-name" readOnly />
                <input type="text" value={`Rs:${post.price}`} className="post-price" readOnly />
                {post.timing && <input type="text" value={post.timing} className="post-timing" readOnly />}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CustomerProfile;
