import { useEffect, useState } from "react";
import { StompSessionProvider } from "react-stomp-hooks";
import "./App.css";
import Navigation from "./components/Navigation";
import StartPage from "./components/Pages/StartPage";
import ListTemperaturePage from "./components/Pages/ListTemperaturePage";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [page, setPage] = useState<string>("");

  useEffect(() => {
    let pageUrl = page;

    if (!pageUrl) {
      const queryParams = new URLSearchParams(window.location.search);
      const getUrl = queryParams.get("page");

      if (getUrl) {
        pageUrl = getUrl;
        setPage(getUrl);
      } else {
        pageUrl = "start"; //Ändra till login när det finns
      }
    }
    window.history.pushState(null, "", "?page=" + pageUrl);
  }, [page]);

  return (
    <>
      <StompSessionProvider url={`${API_URL}/ws-endpoint`}>
        <h1>Projektarbete: Extra allt</h1>
        <Navigation setPage={setPage} />

        {{
          start: <StartPage />,
          listoftemperaturepage: <ListTemperaturePage />,
        }[page] || <StartPage />}
      </StompSessionProvider>
    </>
  );
}

export default App;
