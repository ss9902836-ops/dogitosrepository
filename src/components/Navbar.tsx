import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  UtensilsCrossed, 
  ShoppingCart, 
  TrendingUp, 
  Settings, 
  Flame, 
  AlertTriangle 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lowStockCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, lowStockCount }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventario', icon: Package, badge: lowStockCount },
    { id: 'recipes', label: 'Recetas & Costos', icon: UtensilsCrossed },
    { id: 'pos', label: 'POS & Pedidos', icon: ShoppingCart },
    { id: 'accounting', label: 'Contabilidad', icon: TrendingUp },
    { id: 'settings', label: 'Ajustes & QR', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-2 ring-orange-400/30">
              <Flame className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                DOGITOS
              </span>
              <span className="block text-xs font-medium text-zinc-400 tracking-widest uppercase">
                Fast Food Manager
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/30 ring-1 ring-orange-400/40'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-zinc-900 animate-bounce">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Quick Status */}
          <div className="flex items-center md:hidden">
            {lowStockCount > 0 && (
              <button
                onClick={() => setActiveTab('inventory')}
                className="flex items-center space-x-1.5 bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{lowStockCount} alertas</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-zinc-950 border-t border-zinc-800 py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive ? 'text-orange-400 bg-zinc-900' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium tracking-tight truncate max-w-[60px]">
                {item.label.split(' ')[0]}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
