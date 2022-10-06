import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function Authorization() {
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {}, []);

  return <div>{redirect && <Navigate to="/" />}</div>;
}

export default Authorization;
