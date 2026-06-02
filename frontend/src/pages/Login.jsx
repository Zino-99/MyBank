import { Wallet } from "lucide-react";

const Login = () => {
  return (
    <div className="h-screen flex">
      {/* Partie gauche */}
      <div className="w-1/2 bg-[#0F6A6E] text-white flex flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <Wallet size={32} />
          <span className="text-3xl font-medium">MyBank</span>
        </div>

        <div className="max-w-xl">
          <h1 className="text-6xl font-bold leading-tight">
            Money,
            <br />
            beautifully tracked.
          </h1>

          <p className="mt-8 text-2xl text-white/90 leading-relaxed">
            A clean place to record every operation, sort by category and stay
            in control of your finances.
          </p>
        </div>

        <p className="text-2xl text-white/90">© 2026 MyBank</p>
      </div>

      {/* Partie droite */}
      <div className="w-1/2 bg-[#F3F3F3] flex items-center justify-center">
        <div className="w-[500px]">
          <h2 className="text-6xl font-bold text-black mb-4">
            Welcome back
          </h2>

          <p className="text-2xl text-gray-700 mb-12">
            Sign in to your account to continue.
          </p>

          <form className="space-y-8">
            <div>
              <label className="block text-2xl font-medium mb-3">
                Email
              </label>

              <input
                type="email"
                className="w-full h-16 px-6 rounded-full border border-gray-400 bg-transparent outline-none text-xl focus:ring-2 focus:ring-[#0F6A6E]"
              />
            </div>

            <div>
              <label className="block text-2xl font-medium mb-3">
                Password
              </label>

              <input
                type="password"
                className="w-full h-16 px-6 rounded-full border border-gray-400 bg-transparent outline-none text-xl focus:ring-2 focus:ring-[#0F6A6E]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-16 bg-[#0F6A6E] text-white text-3xl font-semibold rounded-full hover:opacity-90 transition"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;