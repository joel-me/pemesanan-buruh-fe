import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// ✅ Ambil hanya pesanan yang dibuat oleh petani yang login
const fetchOrders = async (token: string) => {
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
  return result.data; // pastikan backend kirim dalam { data: [...] }
};

const updateOrderStatus = async (
  token: string,
  orderId: string,
  newStatus: string
) => {
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
};

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, getToken, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
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
    newStatus: string
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Menunggu
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Diterima
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Selesai
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Dibatalkan
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
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
                  orders
                    .filter(
                      (order) =>
                        order.status === "pending" ||
                        order.status === "accepted"
                    )
                    .map((order) => (
                      <Card key={order.id} className="mb-4">
                        <CardHeader>
                          <CardTitle>{order.farmerName}</CardTitle>
                          <CardDescription>{order.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div>{getStatusBadge(order.status)}</div>
                          <div>Tanggal Mulai: {formatDate(order.startDate)}</div>
                          <div>
                            Tanggal Selesai: {formatDate(order.endDate)}
                          </div>

                          {order.status === "pending" && (
                            <Button
                              onClick={() =>
                                handleStatusUpdate(order.id, "accepted")
                              }
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Terima Pesanan
                            </Button>
                          )}

                          {order.status === "accepted" && (
                            <>
                              <Button
                                onClick={() =>
                                  handleStatusUpdate(order.id, "completed")
                                }
                                className="bg-green-600 hover:bg-green-700 mr-2"
                              >
                                Tandai Selesai
                              </Button>

                              <Button
                                onClick={() =>
                                  handleStatusUpdate(order.id, "cancelled")
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Batalkan Pesanan
                              </Button>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))
                )}
              </TabsContent>

              <TabsContent value="completed">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : error ? (
                  <div className="text-red-600">{error}</div>
                ) : (
                  orders
                    .filter((order) => order.status === "completed")
                    .map((order) => (
                      <Card key={order.id} className="mb-4">
                        <CardHeader>
                          <CardTitle>{order.farmerName}</CardTitle>
                          <CardDescription>{order.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div>{getStatusBadge(order.status)}</div>
                          <div>Tanggal Mulai: {formatDate(order.startDate)}</div>
                          <div>
                            Tanggal Selesai: {formatDate(order.endDate)}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
