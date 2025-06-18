import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/gsm', label: 'GSM', icon: '📱' },
  { to: '/umts', label: 'UMTS', icon: '📶' },
  { to: '/hertzien', label: 'Hertzien', icon: '📡' },
  { to: '/optique', label: 'Optique', icon: '💡' },
  { 
    to: '/simulation', 
    label: 'Simulation', 
    icon: '🌐',
    subItems: [
      { to: '/simulation/link-budget', label: 'Bilan de Liaison', icon: '📊' },
      { to: '/simulation/fresnel', label: 'Zone de Fresnel', icon: '📐' },
      { to: '/simulation/diffraction', label: 'Diffraction', icon: '📈' },
      { to: '/simulation/optique', label: 'Simulation Optique', icon: '💡' }
    ]
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 inset-y-0 w-60 bg-primary-dark text-white flex flex-col justify-between py-8 shadow-2xl font-sans border-r border-primary z-30">
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <div key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-7 py-3 rounded-l-full transition-colors duration-200 text-lg font-semibold outline-none focus-visible:ring-2 focus-visible:ring-white/80
                ${isActive ? 'bg-primary text-white shadow-lg' : 'text-gray-100 hover:bg-primary-light/90 hover:text-white'}`
              }
              aria-label={item.label}
            >
              <span className="text-2xl transition-transform group-hover:scale-110 group-active:scale-95">{item.icon}</span>
              <span className="tracking-tight">{item.label}</span>
            </NavLink>
            {item.subItems && (
              <div className="ml-8 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <NavLink
                    key={subItem.to}
                    to={subItem.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-4 py-2 rounded-l-full transition-colors duration-200 text-sm font-medium outline-none
                      ${isActive ? 'bg-primary/80 text-white' : 'text-gray-300 hover:bg-primary-light/50 hover:text-white'}`
                    }
                    aria-label={subItem.label}
                  >
                    <span className="text-lg transition-transform group-hover:scale-110 group-active:scale-95">{subItem.icon}</span>
                    <span className="tracking-tight">{subItem.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 