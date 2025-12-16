import { useState } from "react";
import { TextInput, PasswordInput, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ---------------------------
  // SIGNUP API CALL
  // ---------------------------
  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Signup failed");
        return;
      }

      alert("Signup successful!");
      navigate("/login");

    } catch (error) {
      alert("Server error, please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-center items-center pt-32 pb-20 px-4">
        <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md">

          <h1
            className="text-center mb-6"
            style={{
              fontFamily: "Sentient, serif",
              fontSize: "38px",
              fontWeight: 700,
            }}
          >
            Create Account
          </h1>

          <div className="space-y-4">

            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              radius="md"
              size="md"
              className="w-full"
              styles={{
                input: { height: 48, fontSize: 16 },
                label: { fontFamily: "Sentient, serif", fontSize: 16 }
              }}
            />

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
                label: { fontFamily: "Sentient, serif", fontSize: 16 }
              }}
            />

            <PasswordInput
              label="Password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              radius="md"
              size="md"
              className="w-full"
              styles={{
                input: { height: 48, fontSize: 16 },
                label: { fontFamily: "Sentient, serif", fontSize: 16 }
              }}
            />

            <Button
              fullWidth
              radius="xl"
              size="md"
              className="mt-4 text-white font-semibold shadow-md"
              style={{
                backgroundColor: "#f97316",
                fontFamily: "Sentient, serif",
                fontSize: "18px",
                padding: "12px 0"
              }}
              onClick={handleSignup}
            >
              Sign Up
            </Button>

            <p
              className="text-center mt-3"
              style={{ fontFamily: "Sentient, serif", fontSize: "16px" }}
            >
              Already have an account?
              <span
                className="text-[#f97316] ml-1 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}
