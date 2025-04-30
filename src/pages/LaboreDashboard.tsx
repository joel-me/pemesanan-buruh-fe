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
import { getMyOrders, updateOrderStatus } from "../lib/api";
import type { Order } from "../lib/types";
import { Badge } from "../components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function LaboreDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token || user.role !== "worker") {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const fetchedOrders = await getMyOrders(token);
        setOrders(fetchedOrders.data);
      } catch (err) {
        setError("Gagal memuat pesanan");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, navigate]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (!token) return;

    try {
      const updatedOrder = await updateOrderStatus(token, orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.data.id ? updatedOrder.data : order
        )
      );
    } catch (err) {
      console.error("Gagal memperbarui status pesanan:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    const badgeStyle = {
      pending: { text: "Menunggu", class: "bg-yellow-100 text-yellow-800" },
      accepted: { text: "Diterima", class: "bg-blue-100 text-blue-800" },
      completed: { text: "Selesai", class: "bg-green-100 text-green-800" },
      cancelled: { text: "Dibatalkan", class: "bg-red-100 text-red-800" },
    }[status];

    return (
      <Badge variant="outline" className={badgeStyle?.class}>
        {badgeStyle?.text || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id });
    } catch (e) {
      return dateString;
    }
  };

  const renderOrders = (filterStatus: "active" | "completed") => {
    const filtered = orders.filter((order) =>
      filterStatus === "active"
        ? order.status === "pending" || order.status === "accepted"
        : order.status === "completed"
    );

    if (filtered.length === 0) {
      return <p>Tidak ada pesanan.</p>;
    }

    return filtered.map((order) => (
      <div
        key={order.id}
        className="mb-4 p-4 bg-white shadow rounded-md border"
      >
        <h3 className="text-lg font-semibold">{order.description}</h3>
        <p className="mt-1">Status: {getStatusBadge(order.status)}</p>
        <p className="text-sm text-gray-600">
          Tanggal Pesanan: {formatDate(order.createdAt)}
        </p>
        {order.status === "accepted" && (
          <Button
            className="mt-2"
            onClick={() => handleStatusUpdate(order.id, "completed")}
          >
            Tandai Selesai
          </Button>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard Buruh (Labore)</h1>
          <div className="flex items-center gap-4">
            <span>Halo, {user?.username || "Guest"}</span>
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
            <CardTitle>Pesanan Anda</CardTitle>
            <CardDescription>Kelola pesanan yang Anda terima</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Pesanan Aktif</TabsTrigger>
                <TabsTrigger value="completed">Pesanan Selesai</TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                {isLoading ? <p>Memuat...</p> : error ? <p>{error}</p> : renderOrders("active")}
              </TabsContent>

              <TabsContent value="completed">
                {isLoading ? <p>Memuat...</p> : error ? <p>{error}</p> : renderOrders("completed")}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
