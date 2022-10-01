import { useState } from "react";
import Categories from "./Categories/Categories";
import Channels from "./Channels/Channels";

function Main() {
  const [displaySelection, setDisplaySelection] = useState(0);
  return (
    <div>
      <div>Twitch Dashboard</div>
      <div>Browse</div>
      <div style={{ display: "flex" }}>
        <div onClick={() => setDisplaySelection(0)} style={{ marginRight: 10 }}>
          Categories
        </div>
        <div onClick={() => setDisplaySelection(1)}>Channels</div>
      </div>
      {displaySelection === 0 && <Categories />}
      {displaySelection === 1 && <Channels />}
    </div>
  );
}

export default Main;
