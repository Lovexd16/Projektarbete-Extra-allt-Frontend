import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  username: string;
  password: string;
}

interface Props {
  setPage: (page: string) => void;
}

function RegisterPage({ setPage }: Props) {
  const [newUser, setNewUser] = useState<User>({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  const registerUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(`${API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...newUser }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Användarnamnet är upptaget.");
        }
        return res.json();
      })
      .then((data) => {
        //Vid lyckad registrering tas man till login sidan
        console.log("Användare lades till: ", data);
        setErrorMessage("");
        setPage("login");
      })
      .catch((error) => {
        console.error("Fel vid tillägning", error);
        setErrorMessage(error.message);
      });
  };

  return (
    <form onSubmit={registerUser}>
      <h3>Registrera</h3>
      <label>
        Användarnamn
        <br />
        <input
          placeholder="Användarnamn"
          type="text"
          required
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        ></input>
      </label>
      <br />
      <br />
      <label>
        Lösenord
        <br />
        <input
          placeholder="Lösenord"
          type="password"
          required
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        ></input>
      </label>
      <br />
      <br />
      {errorMessage && <p style={{ fontSize: "20px" }}>{errorMessage}</p>}
      <button type="submit"> Registrera</button>
    </form>
  );
}

export default RegisterPage;
