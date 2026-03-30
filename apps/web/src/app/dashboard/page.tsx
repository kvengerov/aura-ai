'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ clients: 0, bookings: 0, services: 0 });

  useEffect(() => {
    if (user?.organization_id) {
      fetchClients();
      fetchBookings();
      fetchServices();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://api:4000'}/api/v1/clients`, {
        headers: { 'x-organization-id': user?.organization_id || '' },
      });
      const data = await res.json();
      setStats((s: any) => ({ ...s, clients: Array.isArray(data) ? data.length : 0 }));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://api:4000'}/api/v1/bookings`, {
        headers: { 'x-organization-id': user?.organization_id || '' },
      });
      const data = await res.json();
      setStats((s: any) => ({ ...s, bookings: Array.isArray(data) ? data.length : 0 }));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://api:4000'}/api/v1/services`, {
        headers: { 'x-organization-id': user?.organization_id || '' },
      });
      const data = await res.json();
      setStats((s: any) => ({ ...s, services: Array.isArray(data) ? data.length : 0 }));
    } catch (e) {
      console.error(e);
    }
  };

  const menuItems = [
    { title: 'Clients', href: '/dashboard/clients', icon: '👥', count: stats.clients },
    { title: 'Services', href: '/dashboard/services', icon: '🛠️', count: stats.services },
    { title: 'Staff', href: '/dashboard/staff', icon: '👤', count: 0 },
    { title: 'Bookings', href: '/dashboard/bookings', icon: '📅', count: stats.bookings },
    { title: 'AI Chat', href: '/dashboard/chat', icon: '🤖', count: 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-blue-600">{stats.clients}</div>
          <div className="text-gray-500">Total Clients</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-green-600">{stats.bookings}</div>
          <div className="text-gray-500">Total Bookings</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-purple-600">{stats.services}</div>
          <div className="text-gray-500">Services</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-orange-600">{user?.organizations?.name || '-'}</div>
          <div className="text-gray-500">Organization</div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-semibold">{item.title}</div>
            <div className="text-sm text-gray-500">{item.count} items</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
