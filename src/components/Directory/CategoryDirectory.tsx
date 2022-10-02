import Header from "components/Header/Header";
import Sidebar from "components/Sidebar/Sidebar";
import MainContent from "components/MainContent";

function CategoryDirectory() {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="main-content-container">
        <MainContent />
        <CategoryDirectory />
      </div>
    </div>
  );
}

export default CategoryDirectory;
