import { useEffect, useState } from "react";
import { StompSessionProvider } from "react-stomp-hooks";
import "./App.css";
import Navigation from "./components/Navigation";
import StartPage from "./components/Pages/StartPage";
import ListTemperaturePage from "./components/Pages/ListTemperaturePage";
import RegisterPage from "./components/Pages/RegisterPage";
import LoginPage from "./components/Pages/LoginPage";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [page, setPage] = useState<string>("");

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const savedState = localStorage.getItem("isLoggedIn");
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    let pageUrl = page;

    if (!pageUrl) {
      const queryParams = new URLSearchParams(window.location.search);
      const getUrl = queryParams.get("page");

      if (getUrl) {
        pageUrl = getUrl;
        setPage(getUrl);
      } else {
        pageUrl = "start";
      }
    }
    window.history.pushState(null, "", "?page=" + pageUrl);
  }, [page]);

  return (
    <>
      <StompSessionProvider url={`${API_URL}/ws-endpoint`}>
        <h1>Projektarbete: Extra allt</h1>
        <Navigation
          setPage={setPage}
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
        />

        {{
          start: isLoggedIn ? (
            <StartPage />
          ) : (
            <LoginPage setPage={setPage} setIsLoggedIn={setIsLoggedIn} />
          ),
          listoftemperaturepage: isLoggedIn ? (
            <ListTemperaturePage />
          ) : (
            <LoginPage setPage={setPage} setIsLoggedIn={setIsLoggedIn} />
          ),

          login: !isLoggedIn ? (
            <LoginPage setPage={setPage} setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <StartPage />
          ),
          register: !isLoggedIn ? (
            <RegisterPage setPage={setPage} />
          ) : (
            <StartPage />
          ),
        }[page] || <StartPage />}
      </StompSessionProvider>
    </>
  );
}

export default App;
