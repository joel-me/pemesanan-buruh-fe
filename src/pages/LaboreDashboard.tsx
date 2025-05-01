import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useAuth } from "../lib/auth-context";
import { getMyOrders } from "../lib/api";
import { Order } from "../lib/types";

export default function LaboreDashboard() {
  const { user, getToken, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      if (!user?.id) {
        throw new Error("ID buruh tidak ditemukan");
      }

      const response = await getMyOrders(token);
      console.log('API Response:', response);
      console.log('User ID:', user.id);

      if (!Array.isArray(response)) {
        throw new Error('API response is not an array');
      }

      // Filter orders based on the logged-in laborer's ID
      const laborerOrders = response.filter(order => {
        const orderLaborerId = typeof order.laborerId === 'string' ? parseInt(order.laborerId, 10) : order.laborerId;
        console.log('Order Laborer ID:', orderLaborerId, 'User ID:', user.id);
        return orderLaborerId === user.id;
      });

      console.log('Filtered Orders:', laborerOrders);
      setOrders(laborerOrders);
    } catch (err: any) {
      console.error('Order fetch error:', err);
      setError(err?.message || 'Gagal memuat data pesanan');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderOrderCard = (order: Order) => {
    const statusColors = {
      pending: 'bg-yellow-50 text-yellow-700',
      accepted: 'bg-blue-50 text-blue-700',
      completed: 'bg-green-50 text-green-700',
      cancelled: 'bg-red-50 text-red-700'
    };

    const statusText = {
      pending: 'Menunggu Konfirmasi',
      accepted: 'Diterima',
      completed: 'Selesai',
      cancelled: 'Dibatalkan'
    };

    return (
      <Card key={order.id} className="p-4 mb-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-800">Pesanan #{order.id}</h3>
            <p className={`text-sm font-medium ${statusColors[order.status]}`}>
              Status: {statusText[order.status]}
            </p>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('id-ID')}
          </span>
        </div>
        <p className="text-gray-700 mb-2">{order.description}</p>
        <div className="flex justify-end gap-2">
          {order.status === 'pending' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // TODO: Add accept order functionality
                console.log('Accept order:', order.id);
              }}
            >
              Terima Pesanan
            </Button>
          )}
          {order.status === 'accepted' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // TODO: Add complete order functionality
                console.log('Complete order:', order.id);
              }}
            >
              Tandai Selesai
            </Button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard Buruh</h1>
            <Button onClick={handleLogout} variant="destructive">
              Keluar
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Memuat data pesanan...</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Daftar Pesanan</h2>
              {orders.length > 0 ? (
                orders.map(renderOrderCard)
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Belum ada pesanan yang masuk</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
