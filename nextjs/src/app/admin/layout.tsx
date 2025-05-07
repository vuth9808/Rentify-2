'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if user is logged in and has admin access
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    
    if (!token) {
      router.push('/login');
    } else {
      setIsLoggedIn(true);
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-blue-900 text-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="mr-3 text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/admin" className="text-xl font-bold">Rentify Admin</Link>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="hidden md:inline">Welcome, {userName}</span>
                <Link href="/" className="hover:underline">View Site</Link>
                <button 
                  onClick={handleLogout}
                  className="hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="hover:underline">Login</Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`bg-blue-800 text-white w-64 min-h-screen p-4 transition-all duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed md:static z-40`}
        >
          <nav className="mt-8">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/admin" 
                  className={`block py-2 px-4 rounded ${
                    pathname === '/admin' ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/buildings" 
                  className={`block py-2 px-4 rounded ${
                    pathname === '/admin/buildings' || pathname.startsWith('/admin/buildings/') 
                      ? 'bg-blue-700' 
                      : 'hover:bg-blue-700'
                  }`}
                >
                  Buildings
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/customers" 
                  className={`block py-2 px-4 rounded ${
                    pathname === '/admin/customers' || pathname.startsWith('/admin/customers/') 
                      ? 'bg-blue-700' 
                      : 'hover:bg-blue-700'
                  }`}
                >
                  Customers
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/users" 
                  className={`block py-2 px-4 rounded ${
                    pathname === '/admin/users' || pathname.startsWith('/admin/users/') 
                      ? 'bg-blue-700' 
                      : 'hover:bg-blue-700'
                  }`}
                >
                  Users
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/settings" 
                  className={`block py-2 px-4 rounded ${
                    pathname === '/admin/settings' ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`}
                >
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 