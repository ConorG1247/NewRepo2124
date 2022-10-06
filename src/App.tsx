import Header from "components/Header/Header";
import MainContent from "components/MainContent";
import Sidebar from "components/Sidebar/Sidebar";
import "./App.css";

function App() {
  return (
    <div>
      <Header />
      <Sidebar />
      <a
        href={`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=user:read:follows&state=c3ab8aa609ea11e793ae92361f002671`}
      >
        Connect with Twitch
      </a>
      <div className="main-content-container">
        <MainContent />
      </div>
    </div>
  );
}

export default App;
