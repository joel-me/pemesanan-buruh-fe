import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { getMyPlacedOrders } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Order } from '../lib/types';

const FarmerDashboard: React.FC = () => {
  const { user, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk memvalidasi data pesanan
  const validateOrderData = (orders: Order[]) => {
    return orders.every(order => order.id && order.farmerId && order.laborerId && order.status);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getToken();
        const response = await getMyPlacedOrders(token);

        // Validasi data pesanan sebelum diproses
        if (!validateOrderData(response.data)) {
          console.error('Data pesanan tidak valid:', response.data);
        } else {
          setOrders(response.data);
        }
      } catch (error) {
        console.error('Gagal mengambil pesanan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getToken]);

  const activeOrders = orders.filter(order => order.status === 'pending');
  const completedOrders = orders.filter(order => order.status === 'completed');

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
            <p>Memuat data pesanan...</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Pesanan Aktif</h3>
                {activeOrders.length > 0 ? (
                  activeOrders.map(order => (
                    <div key={order.id} className="border p-4 rounded-lg mb-2 bg-yellow-50">
                      <p className="font-semibold">
                        {order.laborer?.name || 'Nama buruh'} - <span className="text-yellow-700">{order.status}</span>
                      </p>
                      <p className="text-gray-700">{order.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Tidak ada pesanan aktif</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Pesanan Selesai</h3>
                {completedOrders.length > 0 ? (
                  completedOrders.map(order => (
                    <div key={order.id} className="border p-4 rounded-lg mb-2 bg-green-50">
                      <p className="font-semibold">
                        {order.laborer?.name || 'Nama buruh'} - <span className="text-green-700">{order.status}</span>
                      </p>
                      <p className="text-gray-700">{order.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Tidak ada pesanan selesai</p>
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
