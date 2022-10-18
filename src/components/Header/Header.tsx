import { useEffect } from "react";
import { Link } from "react-router-dom";
import UserDisplay from "./UserDisplay";
import {} from "@fortawesome/free-regular-svg-icons"

function Header() {
  useEffect(() => {
    let randomUser = "guest" + Math.floor(Math.random() * 100000);

    if (!localStorage.getItem("username")) {
      localStorage.setItem("username", randomUser);
    }
  }, []);

  return (
    <div className="header-container">
      <Link to="/">
        <img
          className="header-dashboard"
          src={require("images/TwitchLogo.png")}
          alt="twitch-logo"
        />
      </Link>
      <div className="header-mid-container">
        <Link to="/directory/categories">
          <div className="header-browse">Browse</div>
        </Link>
        <input className="header-search" placeholder="Search" />
      </div>
      <UserDisplay />
    </div>
  );
}

export default Header;
