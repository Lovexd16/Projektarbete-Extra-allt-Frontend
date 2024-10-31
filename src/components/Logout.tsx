function Logout({
  setIsLoggedIn,
  setPage,
}: {
  setIsLoggedIn: (loggedIn: boolean) => void;
  setPage: (page: string) => void;
}) {
  //Tar bort token och username from localStorage och skickar användaren till login sidan
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setPage("login");
  };

  return (
    <button className="button" onClick={handleLogout}>
      Logga ut
    </button>
  );
}

export default Logout;
