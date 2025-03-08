
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Button from "../components/Button";
import InputField from "../components/InputField";


const SignupPage: React.FC  = () => {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <div className="border border-gray-600 rounded-lg p-8 w-96 text-center">
        <h2 className="text-xl font-bold mb-6 font-handwriting">Create an Account</h2>
        
        <InputField type="email" placeholder="Email Address*" value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField type="password" placeholder="Password*" value={password} onChange={(e) => setPassword(e.target.value)} />
        <InputField type="password" placeholder="Confirm Password*" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        
        <div className="flex items-center justify-start w-full text-left mb-3">
        <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="mr-2 w-4 h-4" />
        <label className="text-white text-sm">
    By creating an account, you agree with our 
    <a href="#" className="text-blue-400 ml-1">Terms & Conditions</a>
  </label>
</div>
<Button label="Sign Up" onClick={() => console.log(email, password, confirmPassword, agreed)} />

        <span className="block text-sm mb-3">or</span>
        <Button label="Sign Up with Google" onClick={() => console.log("Google Sign Up")} variant="secondary" icon={<FcGoogle />} />
        <p className="text-sm mt-4">
          Already have an account? <a href="#" className="text-blue-400">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
