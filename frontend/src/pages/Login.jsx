import { useState } from "react";
import { Wallet, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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

      setSuccess(true);
      setTimeout(() => navigate("/home"), 1000);
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
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

          {/* Message d'erreur */}
          {error && (
            <p className="text-red-500 text-base mb-5">{error}</p>
          )}

          {/* Message de succès */}
          {success && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-4 mb-5">
              <CheckCircle size={22} className="shrink-0" />
              <span className="text-base font-medium">Authentification réussie ! Redirection...</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-lg md:text-2xl font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                className="w-full h-14 md:h-16 px-6 rounded-full border border-gray-400 bg-transparent outline-none text-lg md:text-xl focus:ring-2 focus:ring-[#0F6A6E] disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-lg md:text-2xl font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
                className="w-full h-14 md:h-16 px-6 rounded-full border border-gray-400 bg-transparent outline-none text-lg md:text-xl focus:ring-2 focus:ring-[#0F6A6E] disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading || success}
              className="w-full h-14 md:h-16 bg-[#0F6A6E] text-white text-xl md:text-3xl font-semibold rounded-full hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Connexion...
                </>
              ) : success ? (
                "Redirection..."
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="mt-10 text-gray-400 text-sm md:hidden">© 2026 MyBank</p>
      </div>
    </div>
  );
};

export default Login;