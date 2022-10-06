import { useState, useEffect } from "react";

function UserDisplay() {
  const [userData, setUserData] = useState<{ user: string; avatar: string }>({
    user: "",
    avatar: "",
  });

  useEffect(() => {
    const username: string = localStorage.getItem("twitch-username") || "";
    const avatar: string = localStorage.getItem("user-avatar") || "";

    if (username.length > 0 || avatar.length > 0) {
      setUserData({ user: username, avatar: avatar });
    }
  }, []);

  return (
    <div className="header-user">
      {userData && userData?.avatar.length > 0 && (
        <img src={userData.avatar} alt={userData.user} />
      )}

      {userData?.avatar.length === 0 && (
        <img
          src="https://static-cdn.jtvnw.net/user-default-pictures-uv/75305d54-c7cc-40d1-bb9c-91fbe85943c7-profile_image-300x300.png"
          alt="guest-avatar"
        />
      )}
    </div>
  );
}

export default UserDisplay;
