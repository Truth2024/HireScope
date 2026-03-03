'use client';
import { motion, LayoutGroup } from 'framer-motion';
type RoleSelectorProps = {
  activeRole: 'candidate' | 'hr';
  onRoleChange: (role: 'candidate' | 'hr') => void;
  t: (key: string) => string;
};

export const RoleSelector = ({ activeRole, onRoleChange, t }: RoleSelectorProps) => (
  <LayoutGroup id="role-selection">
    <div className="flex p-1 bg-gray-100 rounded-xl mb-6 gap-1 relative">
      {['candidate', 'hr'].map((role) => {
        const isActive = activeRole === role;

        return (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange(role as 'candidate' | 'hr')}
            className={`
              relative flex-1 py-2.5 text-sm font-medium rounded-lg 
              transition-colors duration-200 cursor-pointer z-10
              ${isActive ? 'text-(--color-brand)' : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            <span className="relative z-20">{t(`role_${role}`)}</span>

            {isActive && (
              <motion.div
                layoutId="active-role-bg"
                className="absolute inset-0 bg-white rounded-lg shadow-sm z-10"
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 35,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  </LayoutGroup>
);
