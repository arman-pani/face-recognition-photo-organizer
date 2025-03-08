export default function LoginPage() {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="border border-gray-400 p-8 rounded-xl w-[350px] text-center text-white">
          <h2 className="text-xl font-bold mb-6 font-handwriting">Welcome Back!</h2>
          
          <input
            type="email"
            placeholder="Email Address*"
            className="w-full p-2 mb-3 rounded border border-gray-400 bg-transparent text-white"
          />
          
          <input
            type="password"
            placeholder="Password*"
            className="w-full p-2 mb-2 rounded border border-gray-400 bg-transparent text-white"
          />
          
          <div className="text-right text-sm text-blue-400 cursor-pointer mb-4">Forget Password?</div>
          
          <button className="w-full p-2 bg-blue-500 rounded hover:bg-blue-600">Login</button>
          
          <p className="my-2">or</p>
          
          <button className="w-full p-2 border border-gray-400 rounded hover:bg-gray-800">Login with Google</button>
          
          <p className="mt-4 text-sm">
            Don’t have an account? <span className="text-blue-400 cursor-pointer">Sign up</span>
          </p>
        </div>
      </div>
    );
  }
  