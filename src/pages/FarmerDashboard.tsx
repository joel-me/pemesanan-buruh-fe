import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type OrderStatus = "pending" | "accepted" | "completed" | "cancelled";

type Order = {
  id: string;
  description: string;
  startDate: string;
  endDate: string;
  status: OrderStatus;
  laborer: { username: string };
};

const styles: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const label: Record<OrderStatus, string> = {
  pending: "Menunggu",
  accepted: "Diterima",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const fetchOrders = async (token: string) => {
  try {
    const response = await fetch(
      "https://web-pemesanan-buruh-be.vercel.app/api/orders/my-placed-orders",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch farmer orders");
    }
    const result = await response.json();
    return result.data as Order[];
  } catch (error) {
    throw new Error("Gagal mengambil pesanan");
  }
};

const updateOrderStatus = async (
  token: string,
  orderId: string,
  newStatus: OrderStatus
) => {
  try {
    const response = await fetch(
      `https://web-pemesanan-buruh-be.vercel.app/api/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update order status");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    throw new Error("Gagal memperbarui status pesanan");
  }
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
      setIsLoading(true);
      try {
        const token = getToken();
        if (!token) {
          setError("Token tidak ditemukan.");
          return;
        }
        const fetchedOrders = await fetchOrders(token);
        setOrders(fetchedOrders);
      } catch (err) {
        setError("Gagal memuat pesanan");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, navigate, getToken]);

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    const token = getToken();
    if (!token) return;

    try {
      const updatedOrder = await updateOrderStatus(token, orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard Petani</h1>
          <div className="flex items-center gap-4">
            <span>Halo, {isAuthenticated ? "Petani" : "Tamu"}</span>
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Kelola Pesanan Anda</CardTitle>
            <CardDescription>Kelola pesanan buruh tani Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="bg-green-600 hover:bg-green-700 mb-4"
              onClick={() => navigate("/orders/create")}
            >
              Buat Pesanan Baru
            </Button>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Pesanan Aktif</TabsTrigger>
                <TabsTrigger value="completed">Pesanan Selesai</TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : error ? (
                  <div className="text-red-600">{error}</div>
                ) : (
                  orders.filter(
                    (order) =>
                      order.status === "pending" || order.status === "accepted"
                  ).length === 0 ? (
                    <div className="text-center text-gray-600">Tidak ada pesanan aktif</div>
                  ) : (
                    orders
                      .filter(
                        (order) =>
                          order.status === "pending" || order.status === "accepted"
                      )
                      .map((order) => (
                        <div key={order.id} className={`p-4 mb-4 ${styles[order.status]} rounded-lg`}>
                          <h3 className="text-lg font-semibold">{order.description}</h3>
                          <p className="text-sm">Dari Buruh: {order.laborer.username}</p>
                          <p className="text-sm">Tanggal Mulai: {formatDate(order.startDate)}</p>
                          <p className="text-sm">Tanggal Selesai: {formatDate(order.endDate)}</p>
                          <div className="mt-2">
                          <Button variant="outline"
                              onClick={() => handleStatusUpdate(order.id, "completed")}
                            >
                              Tandai Selesai
                            </Button>
                          </div>
                        </div>
                      ))
                  )
                )}
              </TabsContent>

              <TabsContent value="completed">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : error ? (
                  <div className="text-red-600">{error}</div>
                ) : (
                  orders.filter((order) => order.status === "completed").length === 0 ? (
                    <div className="text-center text-gray-600">Tidak ada pesanan selesai</div>
                  ) : (
                    orders
                      .filter((order) => order.status === "completed")
                      .map((order) => (
                        <div key={order.id} className={`p-4 mb-4 ${styles[order.status]} rounded-lg`}>
                          <h3 className="text-lg font-semibold">{order.description}</h3>
                          <p className="text-sm">Dari Buruh: {order.laborer.username}</p>
                          <p className="text-sm">Tanggal Mulai: {formatDate(order.startDate)}</p>
                          <p className="text-sm">Tanggal Selesai: {formatDate(order.endDate)}</p>
                        </div>
                      ))
                  )
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
