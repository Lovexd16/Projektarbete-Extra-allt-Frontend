import Logout from "./Logout";

interface Props {
  setPage: (page: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

function Navigation(props: Props) {
  return (
    <div>
      {props.isLoggedIn && (
        <>
          <button onClick={() => props.setPage("start")}>Startsida</button>
          <button onClick={() => props.setPage("listoftemperaturepage")}>
            Temperaturer
          </button>
          <Logout setIsLoggedIn={props.setIsLoggedIn} setPage={props.setPage} />
        </>
      )}
      {!props.isLoggedIn && (
        <>
          <button onClick={() => props.setPage("login")}>Logga in</button>
          <button onClick={() => props.setPage("register")}>Registrera</button>
        </>
      )}
    </div>
  );
}

export default Navigation;
