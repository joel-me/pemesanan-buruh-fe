import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button'; // Pastikan ini benar
import { useAuth } from '../hooks/useAuth';

interface Order {
  id: number;
  farmerId: number;
  laborerId: number;
  status: string;
  description: string;
  laborerName: string;
}

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    const mockOrders = [
      { id: 1, farmerId: 2, laborerId: 1, status: 'COMPLETED', description: 'Panen padi', laborerName: 'Buruh A' },
      { id: 2, farmerId: 1, laborerId: 6, status: 'PENDING', description: 'Pukul batu', laborerName: 'Buruh B' },
    ];
    setOrders(mockOrders);
  };

  const activeOrders = orders.filter(order => order.status === 'PENDING');
  const completedOrders = orders.filter(order => order.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="bg-white shadow p-6 rounded-xl mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Petani</h1>
          <p className="text-gray-600">Halo, {user?.name || 'Pengguna'}</p>
        </div>
        <Button onClick={() => console.log('Logout')}>Keluar</Button>
      </header>

      <section className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Kelola Pesanan Anda</h2>
            <Button onClick={() => console.log('Create Order')}>Buat Pesanan Baru</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Pesanan Aktif</h3>
              {activeOrders.length > 0 ? (
                activeOrders.map(order => (
                  <div key={order.id} className="border p-4 rounded-lg mb-2 bg-yellow-50">
                    <p className="font-semibold">{order.laborerName} - <span className="text-yellow-700">{order.status}</span></p>
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
                    <p className="font-semibold">{order.laborerName} - <span className="text-green-700">{order.status}</span></p>
                    <p className="text-gray-700">{order.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Tidak ada pesanan selesai</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FarmerDashboard;
