import Header from "components/Header/Header";
import Sidebar from "components/Sidebar/Sidebar";
import MainContent from "components/MainContent";
import CategorySelect from "components/Categories/CategorySelect/CategorySelect";

function Category() {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="main-content-container">
        <MainContent />
        <CategorySelect />
      </div>
    </div>
  );
}

export default Category;
