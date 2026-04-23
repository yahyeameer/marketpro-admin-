import { useState, useEffect } from 'react';

export interface CustomRole {
  id: string;
  name: string;
  color: string;
  permissions: Record<string, boolean>;
}

const defaultRoles: CustomRole[] = [
  { id: 'admin', name: 'Admin', color: 'bg-[#bd9dff]/10 text-[#bd9dff] border-[#bd9dff]/20', permissions: { dashboard: true, visits: true, sales: true, leads: true, employees: true, reports: true, users: true, settings: true } },
  { id: 'manager', name: 'Manager', color: 'bg-[#53ddfc]/10 text-[#53ddfc] border-[#53ddfc]/20', permissions: { dashboard: true, visits: true, sales: true, leads: true, employees: true, reports: true, users: false, settings: false } },
];

export function useCustomRoles() {
  const [roles, setRoles] = useState<CustomRole[]>(defaultRoles);

  useEffect(() => {
    const saved = localStorage.getItem('marketpro_custom_roles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge defaults with saved custom roles, or just use saved if it includes defaults
        setRoles(parsed);
      } catch (e) {
        console.error('Failed to parse custom roles', e);
      }
    } else {
      localStorage.setItem('marketpro_custom_roles', JSON.stringify(defaultRoles));
    }
  }, []);

  const addRole = (role: CustomRole) => {
    const updated = [...roles, role];
    setRoles(updated);
    localStorage.setItem('marketpro_custom_roles', JSON.stringify(updated));
  };

  const deleteRole = (id: string) => {
    const updated = roles.filter(r => r.id !== id);
    setRoles(updated);
    localStorage.setItem('marketpro_custom_roles', JSON.stringify(updated));
  };

  return { roles, addRole, deleteRole };
}
