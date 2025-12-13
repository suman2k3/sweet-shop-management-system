import { useState } from "react";
import Login from "./login";
import Sweets from "./Sweets";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return loggedIn ? (
    <Sweets />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );
}

export default App;
