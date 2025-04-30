"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../lib/auth-context"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { getMyOrders, getMyPlacedOrders, updateOrderStatus, type Order } from "../lib/api"
import { Loader2 } from "lucide-react"
import { Badge } from "../components/ui/badge"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, token, logout } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user || !token) {
      navigate("/login")
      return
    }

    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        let fetchedOrders: Order[]
        if (user.role === "farmer") {
          fetchedOrders = await getMyPlacedOrders(token)
        } else {
          fetchedOrders = await getMyOrders(token)
        }
        setOrders(fetchedOrders)
      } catch (err) {
        setError("Gagal memuat pesanan")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, token, navigate])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (!token) return

    try {
      const updatedOrder = await updateOrderStatus(token, orderId, newStatus)
      setOrders(orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)))
    } catch (err) {
      console.error("Failed to update order status:", err)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Menunggu
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Diterima
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Selesai
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Dibatalkan
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id })
    } catch (e) {
      return dateString
    }
  }

  if (!user || !token) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Pemesanan Jasa Buruh</h1>
          <div className="flex items-center gap-4">
            <span>Halo, {user.username}</span> {/* Update to `user.username` or `user.fullName` */}
            <Button variant="outline" className="text-white border-white hover:bg-green-700" onClick={logout}>
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dashboard {user.role === "farmer" ? "Petani" : "Buruh"}</CardTitle>
            <CardDescription>
              {user.role === "farmer" ? "Kelola pesanan buruh tani Anda" : "Lihat pesanan yang tersedia untuk Anda"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user.role === "farmer" && (
              <Button className="bg-green-600 hover:bg-green-700 mb-4" onClick={() => navigate("/orders/create")}>
                Buat Pesanan Baru
              </Button>
            )}

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Pesanan Aktif</TabsTrigger>
                <TabsTrigger value="completed">Pesanan Selesai</TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : orders.filter((o) => ["pending", "accepted"].includes(o.status)).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Tidak ada pesanan aktif</div>
                ) : (
                  <div className="space-y-4">
                    {orders
                      .filter((order) => ["pending", "accepted"].includes(order.status))
                      .map((order) => (
                        <Card key={order.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">
                                {user.role === "farmer"
                                  ? `Buruh: ${order.laborerName || "Belum ada"}`
                                  : `Petani: ${order.farmerName}`}
                              </CardTitle>
                              {getStatusBadge(order.status)}
                            </div>
                            <CardDescription>Lokasi: {order.location}</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="mb-2">{order.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Mulai:</span> {formatDate(order.startDate)}
                              </div>
                              <div>
                                <span className="font-medium">Selesai:</span> {formatDate(order.endDate)}
                              </div>
                              <div className="col-span-2">
                                <span className="font-medium">Upah:</span> Rp {order.wage.toLocaleString("id-ID")}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            {user.role === "worker" && order.status === "pending" && (
                              <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusUpdate(order.id, "accepted")}
                              >
                                Terima Pesanan
                              </Button>
                            )}
                            {user.role === "worker" && order.status === "accepted" && (
                              <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusUpdate(order.id, "completed")}
                              >
                                Selesaikan Pesanan
                              </Button>
                            )}
                            {order.status === "pending" && (
                              <Button
                                variant="outline"
                                className="ml-auto text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleStatusUpdate(order.id, "cancelled")}
                              >
                                Batalkan
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : orders.filter((o) => ["completed", "cancelled"].includes(o.status)).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Tidak ada pesanan selesai</div>
                ) : (
                  <div className="space-y-4">
                    {orders
                      .filter((order) => ["completed", "cancelled"].includes(order.status))
                      .map((order) => (
                        <Card key={order.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">
                                {user.role === "farmer"
                                  ? `Buruh: ${order.laborerName || "Tidak ada"}`
                                  : `Petani: ${order.farmerName}`}
                              </CardTitle>
                              {getStatusBadge(order.status)}
                            </div>
                            <CardDescription>Lokasi: {order.location}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-2">{order.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Mulai:</span> {formatDate(order.startDate)}
                              </div>
                              <div>
                                <span className="font-medium">Selesai:</span> {formatDate(order.endDate)}
                              </div>
                              <div className="col-span-2">
                                <span className="font-medium">Upah:</span> Rp {order.wage.toLocaleString("id-ID")}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
