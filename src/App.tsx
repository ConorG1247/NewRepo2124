import CategoryDirectory from "components/Directory/CategoryDirectory";
import Header from "components/Header/Header";
import MainContent from "components/MainContent";
import Sidebar from "components/Sidebar/Sidebar";
import "./App.css";

function App() {
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

export default App;
