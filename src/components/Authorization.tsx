import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function Authorization() {
  const [redirect, setRedirect] = useState(false);

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

        console.log(data);

        if (!data.access_token) {
          return;
        }

        console.log(data);

        localStorage.setItem("auth", data.access_token);
      }
    };
    getUserBearerToken();

    setRedirect(true);
  }, [url]);

  return (
    <div>
      {redirect && <Navigate to="/" />}
      {url.includes("error") && <div>Access denied.</div>}
      {url.includes("code") && <div>Redirecting...</div>}
    </div>
  );
}

export default Authorization;
