import { Link } from 'react-router-dom';
import { Plus, Camera, BookOpen, Settings } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: 'Plan New Trip',
      description: 'Create a new travel itinerary',
      to: '/planner',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Camera,
      label: 'Add Photos',
      description: 'Upload travel memories',
      to: '/profile',
      color: 'from-blue-500 to-pink-500'
    },
    {
      icon: BookOpen,
      label: 'View Journals',
      description: 'Read your travel stories',
      to: '/profile',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Manage preferences',
      to: '/edit-profile',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              to={action.to}
              className="group relative overflow-hidden bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-600"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-200`} />
              <div className="relative">
                <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{action.label}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;