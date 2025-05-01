import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { getMyPlacedOrders } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Order } from '../lib/types';

interface FarmerDashboardProps {}

const FarmerDashboard: React.FC<FarmerDashboardProps> = () => {
  const { user, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const validateOrder = (order: any): order is Order => {
    try {
      const isValid =
        typeof order === 'object' &&
        order !== null &&
        typeof order.id === 'number' &&
        typeof order.farmerId === 'number' &&
        typeof order.laborerId === 'number' &&
        typeof order.status === 'string' &&
        typeof order.description === 'string' &&
        (!order.createdAt || typeof order.createdAt === 'string') &&
        (!order.updatedAt || typeof order.updatedAt === 'string') &&
        (!order.laborer ||
          (typeof order.laborer === 'object' &&
            order.laborer !== null &&
            typeof order.laborer.username === 'string'));

      if (!isValid) {
        console.log('Invalid Order Object:', order);
      }

      return isValid;
    } catch (err) {
      console.error('Order validation error:', err);
      return false;
    }
  };

  const fetchOrders = async () => {
    try {
      setError(null);
      setLoading(true);
      const token = getToken();

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await getMyPlacedOrders(token);
      console.log('API Response:', response);

      if (!Array.isArray(response)) {
        throw new Error('API response is not an array');
      }

      const validatedOrders: Order[] = [];
      for (const item of response) {
        if (validateOrder(item)) {
          validatedOrders.push(item);
        } else {
          console.warn('Invalid order format:', item);
        }
      }

      if (validatedOrders.length === 0 && response.length > 0) {
        throw new Error('No valid orders found in response');
      }

      setOrders(validatedOrders);
    } catch (error: any) {
      console.error('Order fetch error:', error);
      setError(error?.message || 'An unknown error occurred while fetching orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [getToken]);

  const activeOrders = orders.filter(order => order.status?.toLowerCase() === 'pending');
  const completedOrders = orders.filter(order => order.status?.toLowerCase() === 'completed');

  const renderOrderCard = (order: Order, bgClass: string, textClass: string) => (
    <div key={order.id} className={`border p-4 rounded-lg mb-2 ${bgClass}`}>
      <p className="font-semibold">
        {order.laborer?.username || 'Nama buruh'} - <span className={textClass}>{order.status}</span>
      </p>
      <p className="text-gray-700">{order.description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="bg-white shadow p-6 rounded-xl mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Petani</h1>
          <p className="text-gray-600">Halo, {user?.name || 'Pengguna'}</p>
        </div>
        <Button onClick={() => { logout(); navigate('/login'); }}>Keluar</Button>
      </header>

      <section className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Kelola Pesanan Anda</h2>
            <Button onClick={() => navigate('/create-order')}>Buat Pesanan Baru</Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <p className="text-gray-500">Memuat data pesanan...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-600 font-medium">Error: {error}</p>
              <p className="text-sm text-red-500 mb-2">Silakan periksa koneksi Anda dan coba lagi.</p>
              <Button variant="outline" className="mt-2" onClick={fetchOrders}>
                Coba Lagi
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Pesanan Aktif</h3>
                {activeOrders.length > 0 ? (
                  activeOrders.map(order =>
                    renderOrderCard(order, 'bg-yellow-50', 'text-yellow-700')
                  )
                ) : (
                  <div className="border border-dashed p-4 rounded-lg bg-gray-50">
                    <p className="text-gray-500 text-center">Tidak ada pesanan aktif</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Pesanan Selesai</h3>
                {completedOrders.length > 0 ? (
                  completedOrders.map(order =>
                    renderOrderCard(order, 'bg-green-50', 'text-green-700')
                  )
                ) : (
                  <div className="border border-dashed p-4 rounded-lg bg-gray-50">
                    <p className="text-gray-500 text-center">Tidak ada pesanan selesai</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FarmerDashboard;
