import Header from "components/Header/Header";
import Sidebar from "components/Sidebar/Sidebar";
import MainContent from "components/MainContent";
import Channels from "components/Channels/Channels";

function CategoryDirectory() {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="main-content-container">
        <MainContent />
        <Channels />
      </div>
    </div>
  );
}

export default CategoryDirectory;
