import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth(); // Using the custom hook instead of direct context access

  const handleLogin = async () => {
    try {
      await auth.login(email, password, setError, navigate);
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // await auth.googleSignIn(); // Assuming Google Sign-in is implemented
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="border border-gray-400 p-8 rounded-xl w-[350px] text-center text-blue-900 bg-white">
        <h2 className="text-xl font-bold mb-6 font-handwriting">Welcome Back!</h2>

        {error && <p className="text-red-500">{error}</p>}

        <InputField type="email" placeholder="Email Address*" value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField type="password" placeholder="Password*" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="text-right text-sm text-blue-400 cursor-pointer mb-4">Forget Password?</div>

        <Button label="Login" onClick={handleLogin} size="large" />

        <p className="my-2">or</p>

        <Button label="Login with Google" onClick={handleGoogleLogin} variant="secondary" icon={<FcGoogle />} size="large" />

        <p className="mt-4 text-sm">
          Don’t have an account? <Link to="/signup" className="text-blue-400 cursor-pointer">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
