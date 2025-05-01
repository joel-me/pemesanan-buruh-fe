import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { getMyPlacedOrders } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Order } from '../lib/types';

// Remove unused ApiResponse interface since we'll type the response directly
// Also removed unused icon imports that were causing errors

const FarmerDashboard: React.FC = () => {
  const { user, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validateOrder = (order: unknown): order is Order => {
    return (
      typeof order === 'object' &&
      order !== null &&
      'id' in order &&
      'farmerId' in order &&
      'laborerId' in order &&
      'status' in order
    );
  };

  const validateOrderData = (data: unknown): data is Order[] => {
    if (!Array.isArray(data)) return false;
    return data.every(validateOrder);
  };

  const fetchOrders = async () => {
    try {
      setError(null);
      setLoading(true);
      const token = getToken();
      
      // Type the response directly instead of using ApiResponse interface
      const response = await getMyPlacedOrders(token);

      if (!response || typeof response !== 'object' || !('data' in response)) {
        throw new Error('Invalid API response structure');
      }

      if (!validateOrderData(response.data)) {
        throw new Error('Received invalid orders data format');
      }

      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [getToken]);

  const activeOrders = orders.filter(order => order.status === 'pending');
  const completedOrders = orders.filter(order => order.status === 'completed');

  const renderOrderCard = (order: Order, bgClass: string, textClass: string) => (
    <div key={order.id} className={`border p-4 rounded-lg mb-2 ${bgClass}`}>
      <p className="font-semibold">
        {order.laborer?.name || 'Nama buruh'} - <span className={textClass}>{order.status}</span>
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
              <Button 
                variant="outline" 
                className="mt-2" 
                onClick={() => fetchOrders()}
              >
                Coba Lagi
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Pesanan Aktif</h3>
                {activeOrders.length > 0 ? (
                  activeOrders.map(order => renderOrderCard(order, 'bg-yellow-50', 'text-yellow-700'))
                ) : (
                  <div className="border border-dashed p-4 rounded-lg bg-gray-50">
                    <p className="text-gray-500 text-center">Tidak ada pesanan aktif</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Pesanan Selesai</h3>
                {completedOrders.length > 0 ? (
                  completedOrders.map(order => renderOrderCard(order, 'bg-green-50', 'text-green-700'))
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