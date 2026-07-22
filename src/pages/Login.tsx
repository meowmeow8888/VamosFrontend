import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useAuth } from "../providers/AuthProvider";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const isDisabled = !(name !== "" && password !== "");
  const [error, setError] = useState("");
  const { refreshSession } = useAuth();

  const handleLogin = async () => {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, password: password }),
    });
    if (res.status === 401) {
      setError("Invalid username or password. Please try again.");
      return;
    }
    setError("");
    refreshSession();
    console.log("after /me")
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <input
        className="bg-gray-500 border-none rounded-xl m-2 p-3"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <input
        className="bg-gray-500 border-none rounded-xl m-2 p-3"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isDisabled) {
            handleLogin();
          }
        }}
      ></input>
      <button
        className="bg-blue-600 m-2 py-2 px-6 rounded-xl active:bg-blue-500 transition-colors disabled:bg-gray-700"
        onClick={() => handleLogin()}
        disabled={isDisabled}
      >
        Login
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

export default Login;
