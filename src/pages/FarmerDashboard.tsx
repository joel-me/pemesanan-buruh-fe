import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Loader2 } from "lucide-react";

type OrderStatus = "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";

type Order = {
  id: string;
  description: string;
  status: OrderStatus;
  laborer: { username: string };
};

const styles: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
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
      throw new Error("Failed to fetch orders");
    }
    const result = await response.json();
    console.log(result); // Log the result to check the structure of the data
    return result.data || []; // Make sure to return an empty array if no data is present
  } catch (error) {
    throw new Error("Failed to fetch orders");
  }
};

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, getToken, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]); // Initialize orders as an empty array
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
          setError("Token not found.");
          return;
        }
        const fetchedOrders = await fetchOrders(token);
        setOrders(fetchedOrders);
      } catch (err) {
        setError("Failed to load orders");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, navigate, getToken]);

  // Ensure orders is an array before applying .filter
  const activeOrders = Array.isArray(orders)
    ? orders.filter((order) => order.status === "PENDING" || order.status === "ACCEPTED")
    : [];
  const completedOrders = Array.isArray(orders)
    ? orders.filter((order) => order.status === "COMPLETED")
    : [];

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
                ) : activeOrders.length === 0 ? (
                  <div className="text-center text-gray-600">Tidak ada pesanan aktif</div>
                ) : (
                  activeOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 mb-4 ${styles[order.status]} rounded-lg`}
                    >
                      <p className="text-lg font-semibold">{order.laborer.username}</p>
                      <p className="text-sm">Status: {order.status}</p>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : error ? (
                  <div className="text-red-600">{error}</div>
                ) : completedOrders.length === 0 ? (
                  <div className="text-center text-gray-600">Tidak ada pesanan selesai</div>
                ) : (
                  completedOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 mb-4 ${styles[order.status]} rounded-lg`}
                    >
                      <p className="text-lg font-semibold">{order.laborer.username}</p>
                      <p className="text-sm">Status: {order.status}</p>
                    </div>
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
