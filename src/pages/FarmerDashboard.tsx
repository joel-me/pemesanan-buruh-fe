import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button'; // Adjusted import if no 'ui' folder exists
import { useAuth } from '../hooks/useAuth'; // Assuming you have the `useAuth` hook in the 'hooks' folder

interface Order {
  id: number;
  farmerId: number;
  laborerId: number;
  status: string;
  description: string;
  laborerName: string;  // Assuming laborer name is part of the data
}

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();  // Assuming you are using the `useAuth` hook
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch orders when the component mounts
  useEffect(() => {
    // Fetch orders from API or a mock function
    fetchOrders();
  }, []);

  // Mock fetchOrders function (replace with your actual API call)
  const fetchOrders = () => {
    const mockOrders = [
      { id: 1, farmerId: 2, laborerId: 1, status: 'COMPLETED', description: 'with rice harvesting', laborerName: 'Buruh A' },
      { id: 2, farmerId: 1, laborerId: 6, status: 'PENDING', description: 'pukul batu', laborerName: 'Buruh B' },
    ];
    setOrders(mockOrders);
  };

  const activeOrders = orders.filter(order => order.status === 'PENDING');
  const completedOrders = orders.filter(order => order.status === 'COMPLETED');

  return (
    <div>
      <header>
        <h1>Dashboard Petani</h1>
        <p>Halo, {user?.name}</p>
        <Button onClick={() => console.log('Logout')}>Keluar</Button>
      </header>

      <section>
        <h2>Kelola Pesanan Anda</h2>
        <Button onClick={() => console.log('Create Order')}>Buat Pesanan Baru</Button>

        <div>
          <h3>Pesanan Aktif</h3>
          {activeOrders.length > 0 ? (
            activeOrders.map(order => (
              <div key={order.id}>
                <p><strong>{order.laborerName}</strong> - {order.status}</p>
                <p>{order.description}</p>
              </div>
            ))
          ) : (
            <p>Tidak ada pesanan aktif</p>
          )}
        </div>

        <div>
          <h3>Pesanan Selesai</h3>
          {completedOrders.length > 0 ? (
            completedOrders.map(order => (
              <div key={order.id}>
                <p><strong>{order.laborerName}</strong> - {order.status}</p>
                <p>{order.description}</p>
              </div>
            ))
          ) : (
            <p>Tidak ada pesanan selesai</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default FarmerDashboard;
