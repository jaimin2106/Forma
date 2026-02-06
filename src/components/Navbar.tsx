import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Logo } from '@/components/Logo';

// Data for navigation items and dropdowns
// Data for navigation items and dropdowns
const navItems = [
    {
        name: 'Platform',
        dropdown: [
            { name: 'Features', href: '/platform/features' },
            { name: 'Integrations', href: '/platform/integrations' },
            { name: 'API', href: '/platform/api' }
        ]
    },
    {
        name: 'Solutions',
        dropdown: [
            { name: 'Marketing', href: '/solutions/marketing' },
            { name: 'Product', href: '/solutions/product' },
            { name: 'HR', href: '/solutions/hr' }
        ]
    },
    {
        name: 'Resources',
        dropdown: [
            { name: 'Blog', href: '/resources/blog' },
            { name: 'Help Center', href: '/resources/help' },
            { name: 'Community', href: '/resources/community' }
        ]
    },
    { name: 'Enterprise', href: '/enterprise' },
    { name: 'Pricing', href: '/pricing' },
];

export const Navbar = () => {
    const { user, signOut } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setIsHidden(true);
        } else {
            setIsHidden(false);
        }
        setIsScrolled(latest > 20);
    });

    useEffect(() => {
        const handleResize = () => { if (window.innerWidth > 768) setIsMobileMenuOpen(false); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const mobileMenuVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: 'auto', transition: { staggerChildren: 0.05 } },
        exit: { opacity: 0, height: 0 },
    };

    const mobileLinkVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
    };

    return (

        <motion.header
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={isHidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Logo />

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center flex-1">
                        <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/20 shadow-sm">
                            {navItems.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative h-full"
                                    onMouseEnter={() => setHoveredItem(item.name)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    <Link
                                        to={item.href || '#'}
                                        className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors relative z-10"
                                    >
                                        <span>{item.name}</span>
                                        {item.dropdown && <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${hoveredItem === item.name ? 'rotate-180' : ''}`} />}
                                    </Link>

                                    {/* Active Highlight Pill */}
                                    {hoveredItem === item.name && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute inset-0 bg-gray-100/80 rounded-full z-0"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {item.dropdown && hoveredItem === item.name && (
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-60 z-50">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" }}
                                                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" }}
                                                    transition={{ duration: 0.2 }}
                                                    className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden p-2"
                                                >
                                                    {item.dropdown.map((subItem) => (
                                                        <Link
                                                            key={subItem.name}
                                                            to={subItem.href}
                                                            className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-700 rounded-xl transition-colors"
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
                        {user ? (
                            <>
                                <Link to="/dashboard"><Button variant="ghost" className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/50">Dashboard</Button></Link>
                                <Button onClick={signOut} variant="outline" className="text-sm font-medium border-gray-200 hover:bg-gray-50">Sign Out</Button>
                            </>
                        ) : (
                            <>
                                <Link to="/auth"><Button variant="ghost" className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/50">Log in</Button></Link>
                                <Link to="/auth">
                                    <Button className="bg-slate-900 text-white hover:bg-slate-800 text-sm font-medium px-5 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                                        Sign up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex-shrink-0">
                        <button className="p-2 text-gray-600 hover:bg-gray-100/50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full shadow-2xl h-screen overflow-y-auto"
                    >
                        <div className="flex flex-col space-y-1 p-4 pb-24">
                            {navItems.map((item) => (
                                <motion.div key={item.name} variants={mobileLinkVariants}>
                                    <div className="w-full">
                                        {item.dropdown ? (
                                            <>
                                                <button
                                                    onClick={() => setActiveMobileDropdown(activeMobileDropdown === item.name ? null : item.name)}
                                                    className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                                >
                                                    {item.name}
                                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeMobileDropdown === item.name ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {activeMobileDropdown === item.name && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden bg-gray-50/50 rounded-xl mx-2"
                                                        >
                                                            {item.dropdown.map((subItem) => (
                                                                <Link
                                                                    key={subItem.name}
                                                                    to={subItem.href}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="block px-4 py-3 text-sm text-gray-600 hover:text-violet-600 pl-8 transition-colors"
                                                                >
                                                                    {subItem.name}
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            <Link
                                                to={item.href || '#'}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50 absolute bottom-0 w-full pb-8">
                            {user ? (
                                <motion.div variants={mobileLinkVariants}><Button onClick={signOut} className="w-full rounded-xl h-12 text-base">Sign Out</Button></motion.div>
                            ) : (
                                <div className="flex flex-col space-y-3">
                                    <motion.div variants={mobileLinkVariants}><Link to="/auth"><Button variant="ghost" className="w-full justify-center h-12 text-base hover:bg-white border border-transparent hover:border-gray-200">Log in</Button></Link></motion.div>
                                    <motion.div variants={mobileLinkVariants}><Link to="/auth"><Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-lg h-12 text-base">Sign up</Button></Link></motion.div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};