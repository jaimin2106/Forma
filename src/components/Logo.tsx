import { Link } from 'react-router-dom';

export const Logo = ({ className = "" }: { className?: string }) => {
    return (
        <Link to="/" className={`flex items-center space-x-2 flex-shrink-0 group ${className}`}>
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <div className="w-4 h-4 border-2 border-white/90 rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
                Forma
            </span>
        </Link>
    );
};
