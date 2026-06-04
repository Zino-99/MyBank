import { Wallet, LayoutGrid, Tag, LogOut } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Wallet size={24} className="text-[#0F6A6E]" />
        <span className="text-xl font-semibold text-[#0F6A6E]">MyBank</span>
      </div>

      {/* Navigation — cachée sur mobile */}
      <div className="hidden md:flex items-center gap-3">
        <button className="flex items-center gap-2 bg-[#0F6A6E] text-white px-6 py-3 rounded-full text-base font-medium hover:opacity-90 transition">
          <LayoutGrid size={18} />
          Operations
        </button>
        <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-full text-base font-medium hover:bg-gray-100 transition">
          <Tag size={18} />
          Categories
        </button>
      </div>

      {/* Sign out */}
      <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-full text-base font-medium hover:bg-gray-100 transition">
        <LogOut size={18} />
        <span className="hidden md:inline">Sign out</span>
      </button>

      {/* Menu mobile — visible uniquement sur mobile */}
      <div className="flex md:hidden items-center gap-2">
        <button className="flex items-center gap-1 bg-[#0F6A6E] text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition">
          <LayoutGrid size={16} />
        </button>
        <button className="flex items-center gap-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition">
          <Tag size={16} />
        </button>
      </div>

    </nav>
  );
};

export default Navbar;