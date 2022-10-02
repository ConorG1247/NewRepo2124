import Header from "components/Header/Header";
import Sidebar from "components/Sidebar/Sidebar";
import MainContent from "components/MainContent";
import Categories from "components/Categories/Categories";

function CategoryDirectory() {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="main-content-container">
        <MainContent />
        <Categories />
      </div>
    </div>
  );
}

export default CategoryDirectory;
