import { useState } from "react";
import { TextInput, PasswordInput, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      // Save token + userId
     localStorage.setItem("token", data.token);        // ✅ FIX
localStorage.setItem("userId", data.user_id);
localStorage.setItem("username", data.username); // ✅ FIX



       // ⭐ REQUIRED FOR HISTORY ⭐

      navigate("/");
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md">
        
        <h1
          className="text-center mb-6"
          style={{
            fontFamily: "Sentient, serif",
            fontSize: "38px",
            fontWeight: 700,
          }}
        >
          Login
        </h1>

        <div className="space-y-4">
          
          {/* Email */}
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            radius="md"
            size="md"
            className="w-full"
            styles={{
              input: { height: 48, fontSize: 16 },
              label: { fontFamily: "Sentient, serif", fontSize: 16 },
            }}
          />

          {/* Password */}
          <PasswordInput
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            radius="md"
            size="md"
            className="w-full"
            styles={{
              input: { height: 48, fontSize: 16 },
              label: { fontFamily: "Sentient, serif", fontSize: 16 },
            }}
          />

          {/* Login Button */}
          <Button
            fullWidth
            radius="xl"
            size="md"
            className="mt-4 text-white font-semibold shadow-md"
            style={{
              backgroundColor: "#f97316",
              fontFamily: "Sentient, serif",
              fontSize: "18px",
              padding: "12px 0",
            }}
            onClick={handleLogin}
          >
            Login
          </Button>

          {/* Redirect */}
          <p
            className="text-center mt-3"
            style={{ fontFamily: "Sentient, serif", fontSize: "16px" }}
          >
            Don’t have an account?
            <span
              className="text-[#f97316] ml-1 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}
