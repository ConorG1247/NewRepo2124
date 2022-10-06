import { useEffect } from "react";
import { Link } from "react-router-dom";

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
        <div className="header-dashboard">Dashboard</div>
      </Link>
      <div className="header-dashboard">Browse</div>
      <input className="header-search" placeholder="Search" />
      <div className="header-user">User</div>
    </div>
  );
}

export default Header;
