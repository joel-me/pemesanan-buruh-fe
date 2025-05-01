import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2 } from "lucide-react";

type Order = {
  id: string;
  description: string;
  status: string;
  laborer: { username: string };
};

const fetchOrders = async (token: string) => {
  const response = await fetch(
    "https://web-pemesanan-buruh-be.vercel.app/api/orders/my-placed-orders",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error("Gagal mengambil pesanan");
  const result = await response.json();
  return result.data as Order[];
};

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, getToken, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadOrders = async () => {
      try {
        const token = getToken();
        if (!token) return setError("Token tidak ditemukan");
        const fetchedOrders = await fetchOrders(token);
        setOrders(fetchedOrders);
      } catch (err) {
        setError("Gagal memuat pesanan");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, navigate, getToken]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard Petani</h1>
          <div className="flex items-center gap-4">
            <span>Halo, Petani</span>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-green-700"
              onClick={logout}
            >
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : orders.length === 0 ? (
              <div className="text-center text-gray-600">Tidak ada pesanan</div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="p-4 border-b border-gray-300">
                  <p><strong>Nama Pekerja:</strong> {order.laborer?.username || "Tidak diketahui"}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
