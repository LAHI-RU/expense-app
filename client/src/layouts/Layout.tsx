import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';

const navLinks = [
    {
        name: 'Dashboard', href: '/app', icon: (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0v6m0 0H7m6 0h6" /></svg>
        )
    },
    {
        name: 'Employees', href: '/app/employees', icon: (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" /></svg>
        )
    },
    {
        name: 'Expenses', href: '/app/expenses', icon: (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0H9m3 0h3" /></svg>
        )
    },
    {
        name: 'Reports', href: '/app/reports', icon: (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4m-4 0V7a4 4 0 00-4-4H5a4 4 0 00-4 4v10a4 4 0 004 4h4a4 4 0 004-4z" /></svg>
        )
    },
];

export default function Layout() {
    const nav = useNavigate();
    const location = useLocation();
    const logout = () => { localStorage.removeItem('token'); nav('/login'); };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Topbar */}
            <header className="flex items-center justify-between bg-white shadow px-6 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-700 tracking-tight">ExpenseApp</span>
                </div>
                <button onClick={logout} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Logout</button>
            </header>
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r shadow-sm flex flex-col py-6 px-4">
                    <nav className="flex flex-col gap-2">
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`flex items-center px-3 py-2 rounded text-gray-700 hover:bg-blue-100 transition font-medium ${location.pathname === link.href ? 'bg-blue-50 text-blue-700 font-semibold' : ''}`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </aside>
                {/* Main content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
