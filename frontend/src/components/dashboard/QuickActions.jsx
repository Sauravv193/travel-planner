import { Link } from 'react-router-dom';
import { Plus, Camera, BookOpen, Settings } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { icon: Plus, label: 'Plan New Trip', description: 'Create a new itinerary', to: '/planner', color: 'from-maroon-500 to-maroon-600' },
    { icon: Camera, label: 'Add Photos', description: 'Upload travel memories', to: '/profile', color: 'from-brown-500 to-brown-600' },
    { icon: BookOpen, label: 'View Journals', description: 'Read travel stories', to: '/profile', color: 'from-beige-500 to-beige-600' },
    { icon: Settings, label: 'Settings', description: 'Manage preferences', to: '/edit-profile', color: 'from-cream-500 to-cream-600' },
  ];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-warm-dark dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={index} to={action.to} className="group relative overflow-hidden bg-cream-50/50 dark:bg-night-surface/50 backdrop-blur-sm rounded-lg p-4 hover:shadow-md transition-all duration-200 border border-cream-100 dark:border-night-border hover:border-maroon-300 dark:hover:border-maroon-500/40">
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-200`} />
              <div className="relative">
                <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-medium text-warm-dark dark:text-white text-sm mb-1">{action.label}</h4>
                <p className="text-xs text-cream-500 dark:text-night-muted">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
