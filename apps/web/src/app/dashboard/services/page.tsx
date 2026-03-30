'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useServices } from '@/hooks/useServices';

export default function ServicesPage() {
  const { user } = useAuth();
  const { services, loading, fetchServices, createService } = useServices();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', category: '', price: '', duration_min: '30' });

  useEffect(() => {
    if (user?.organization_id) {
      fetchServices(user.organization_id).catch(console.error);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.organization_id) return;
    
    try {
      await createService(user.organization_id, {
        ...formData,
        price: parseFloat(formData.price) || 0,
        duration_min: parseInt(formData.duration_min) || 30,
      });
      setFormData({ name: '', description: '', category: '', price: '', duration_min: '30' });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Service Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={formData.duration_min}
                onChange={(e) => setFormData({ ...formData, duration_min: e.target.value })}
                className="p-2 border rounded"
              />
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Save
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{service.name}</h3>
              {service.is_active && <span className="text-green-600 text-sm">Active</span>}
            </div>
            {service.category && <div className="text-sm text-gray-500 mb-2">{service.category}</div>}
            {service.description && <div className="text-gray-600 text-sm mb-2">{service.description}</div>}
            <div className="flex justify-between text-sm">
              <span className="font-medium">${service.price || 0}</span>
              <span className="text-gray-500">{service.duration_min} min</span>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-8">
            No services yet
          </div>
        )}
      </div>
    </div>
  );
}
