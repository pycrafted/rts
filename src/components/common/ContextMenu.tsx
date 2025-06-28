import React, { useState, useEffect, useRef } from 'react';

export interface ContextMenuItem {
  id: string;
  label?: string;
  icon?: string;
  action?: () => void;
  disabled?: boolean;
  separator?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ 
  items, 
  children, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
    
    setIsOpen(true);
  };

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled && item.action) {
      item.action();
      setIsOpen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      onContextMenu={handleContextMenu}
    >
      {children}
      
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-48"
          style={{
            left: position.x,
            top: position.y
          }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Menu contextuel par défaut pour les simulations
export const getDefaultContextMenuItems = (
  onSave?: () => void,
  onOpen?: () => void,
  onExportPDF?: () => void,
  onNew?: () => void
): ContextMenuItem[] => [
  {
    id: 'new',
    label: 'Nouvelle simulation',
    icon: '📄',
    action: onNew || (() => console.log('Nouvelle simulation')),
  },
  {
    id: 'open',
    label: 'Ouvrir...',
    icon: '📂',
    action: onOpen || (() => console.log('Ouvrir fichier')),
  },
  {
    id: 'save',
    label: 'Sauvegarder',
    icon: '💾',
    action: onSave || (() => console.log('Sauvegarder')),
  },
  { id: 'separator1', separator: true },
  {
    id: 'export-pdf',
    label: 'Exporter en PDF',
    icon: '📊',
    action: onExportPDF || (() => console.log('Exporter PDF')),
  },
  {
    id: 'export-json',
    label: 'Exporter en JSON',
    icon: '📋',
    action: () => console.log('Exporter JSON'),
  },
  { id: 'separator2', separator: true },
  {
    id: 'copy',
    label: 'Copier',
    icon: '📋',
    action: () => console.log('Copier'),
  },
  {
    id: 'paste',
    label: 'Coller',
    icon: '📋',
    action: () => console.log('Coller'),
  },
  { id: 'separator3', separator: true },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: '⚙️',
    action: () => console.log('Paramètres'),
  },
  {
    id: 'help',
    label: 'Aide',
    icon: '❓',
    action: () => console.log('Aide'),
  }
]; 