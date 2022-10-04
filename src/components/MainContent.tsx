import { Link } from "react-router-dom";

function MainContent() {
  const url = window.location.href.split("/directory/")[1];

  return (
    <div className="main-container">
      <div className="main-title">Browse</div>
      <div className="main-selection-container">
        <Link to="/directory/categories">
          <div
            className={
              url === "categories"
                ? "main-selection-selected"
                : "main-selection"
            }
          >
            Categories
          </div>
        </Link>
        <Link to="/directory/channels">
          <div
            className={
              url === "channels" ? "main-selection-selected" : "main-selection"
            }
          >
            Live Channels
          </div>
        </Link>
      </div>
    </div>
  );
}

export default MainContent;
