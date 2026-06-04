import { useState } from "react";
import { Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Email ou mot de passe incorrect.");
        return;
      }

      navigate("/home");
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Panneau gauche — caché sur mobile */}
      <div className="hidden md:flex md:w-1/2 bg-[#0F6A6E] text-white flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <Wallet size={32} />
          <span className="text-3xl font-medium">MyBank</span>
        </div>
        <div className="max-w-xl">
          <h1 className="text-6xl font-bold leading-tight">
            Money,<br />beautifully tracked.
          </h1>
          <p className="mt-8 text-2xl text-white/90 leading-relaxed">
            A clean place to record every operation, sort by category and stay in control of your finances.
          </p>
        </div>
        <p className="text-2xl text-white/90">© 2026 MyBank</p>
      </div>

      {/* Panneau droit */}
      <div className="flex-1 bg-[#F3F3F3] flex flex-col items-center justify-center px-6 py-12 md:px-12">
        
        {/* Logo visible uniquement sur mobile */}
        <div className="flex items-center gap-2 mb-10 md:hidden">
          <div className="bg-[#0F6A6E] text-white p-2 rounded-xl">
            <Wallet size={24} />
          </div>
          <span className="text-2xl font-semibold text-[#0F6A6E]">MyBank</span>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-3">Welcome back</h2>
          <p className="text-lg md:text-2xl text-gray-700 mb-10">Sign in to your account to continue.</p>

          {error && <p className="text-red-500 text-base mb-5">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-lg md:text-2xl font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 md:h-16 px-6 rounded-full border border-gray-400 bg-transparent outline-none text-lg md:text-xl focus:ring-2 focus:ring-[#0F6A6E]"
              />
            </div>
            <div>
              <label className="block text-lg md:text-2xl font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 md:h-16 px-6 rounded-full border border-gray-400 bg-transparent outline-none text-lg md:text-xl focus:ring-2 focus:ring-[#0F6A6E]"
              />
            </div>
            <button
              type="submit"
              className="w-full h-14 md:h-16 bg-[#0F6A6E] text-white text-xl md:text-3xl font-semibold rounded-full hover:opacity-90 transition"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="mt-10 text-gray-400 text-sm md:hidden">© 2026 MyBank</p>
      </div>
    </div>
  );
};

export default Login;