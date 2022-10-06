import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function Authorization() {
  const [redirect, setRedirect] = useState(false);
  const [bearerCheck, setBearerCheck] = useState(false);

  const url = window.location.href;

  useEffect(() => {
    const code = url.split("code=")[1].split("&scope")[0];

    const getUserBearerToken = async () => {
      if (url.includes("code")) {
        const res = await fetch(`https://id.twitch.tv/oauth2/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: `${process.env.REACT_APP_CLIENT_ID}`,
            client_secret: `${process.env.REACT_APP_CLIENT_SECRET}`,
            code: `${code}`,
            grant_type: "authorization_code",
            redirect_uri: `${process.env.REACT_APP_REDIRECT_URI}`,
          }),
        });

        const data = await res.json();

        if (!data.access_token) {
          return;
        }

        localStorage.setItem("auth", data.access_token);

        setBearerCheck(true);
      }
    };
    getUserBearerToken();

    setRedirect(true);
  }, [url]);

  useEffect(() => {
    const getUserData = async () => {
      const res = await fetch("https://api.twitch.tv/helix/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
          "Client-Id": `${process.env.REACT_APP_CLIENT_ID}`,
        },
      });
      const data = await res.json();

      if (!data.data[0]) {
        return;
      }

      localStorage.setItem("user-avatar", data.data[0].profile_image_url);
      localStorage.setItem("twitch-username", data.data[0].display_name);
    };

    getUserData();
  }, [bearerCheck]);

  return (
    <div>
      {redirect && <Navigate to="/" />}
      {url.includes("error") && <div>Access denied.</div>}
      {url.includes("code") && <div>Redirecting...</div>}
    </div>
  );
}

export default Authorization;
