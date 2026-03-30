'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useClients } from '@/hooks/useClients';
import { useBookings } from '@/hooks/useBookings';
import { useServices } from '@/hooks/useServices';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const clientsHook = useClients();
  const bookingsHook = useBookings();
  const servicesHook = useServices();

  useEffect(() => {
    if (user?.organization_id) {
      clientsHook.fetchClients(user.organization_id).catch(console.error);
      bookingsHook.fetchBookings(user.organization_id).catch(console.error);
      servicesHook.fetchServices(user.organization_id).catch(console.error);
    }
  }, [user]);

  const menuItems = [
    { title: 'Clients', href: '/dashboard/clients', icon: '👥', count: clientsHook.clients.length },
    { title: 'Services', href: '/dashboard/services', icon: '🛠️', count: servicesHook.services.length },
    { title: 'Staff', href: '/dashboard/staff', icon: '👤', count: 0 },
    { title: 'Bookings', href: '/dashboard/bookings', icon: '📅', count: bookingsHook.bookings.length },
    { title: 'AI Chat', href: '/dashboard/chat', icon: '🤖', count: 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-blue-600">{clientsHook.clients.length}</div>
          <div className="text-gray-500">Total Clients</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-green-600">{bookingsHook.bookings.length}</div>
          <div className="text-gray-500">Total Bookings</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-purple-600">{servicesHook.services.length}</div>
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
