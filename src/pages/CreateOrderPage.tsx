import type React from "react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../lib/auth-context"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Loader2 } from "lucide-react"
import { createOrder } from "../lib/api"

// Define the types for formData
interface FormData {
  laborerId: string
  description: string
  startDate: string
  endDate: string
  wage: string
}

export default function CreateOrderPage() {
  const navigate = useNavigate()
  const { isAuthenticated, getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()

  const [formData, setFormData] = useState<FormData>({
    laborerId: "",
    description: "",
    startDate: "",
    endDate: "",
    wage: "",
  })

  React.useEffect(() => {
    const params = new URLSearchParams(location.search)
    const laborerIdFromQuery = params.get("laborerId")
    if (laborerIdFromQuery) {
      setFormData((prev) => ({
        ...prev,
        laborerId: laborerIdFromQuery,
      }))
    }
    // eslint-disable-next-line
  }, [location.search])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getToken()

    if (!token || !isAuthenticated) {
      setError("Anda harus login untuk membuat pesanan.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await createOrder(token, {
        laborerId: Number.parseInt(formData.laborerId),
        description: formData.description,
        wage: Number.parseFloat(formData.wage),
        startDate: formData.startDate,
        endDate: formData.endDate,
      })

      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat pesanan.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    navigate("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Buat Pesanan Baru</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="laborerId">ID Buruh</Label>
                <Input
                  id="laborerId"
                  name="laborerId"
                  type="number"
                  value={formData.laborerId}
                  onChange={handleChange}
                  placeholder="Masukkan ID buruh"
                  required
                  disabled={!!formData.laborerId || isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Pekerjaan</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Jelaskan pekerjaan yang perlu dilakukan"
                  required
                  disabled={isLoading}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal Mulai</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Tanggal Selesai</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wage">Upah (Rp)</Label>
                <Input
                  id="wage"
                  name="wage"
                  type="number"
                  value={formData.wage}
                  onChange={handleChange}
                  placeholder="Masukkan jumlah upah dalam Rupiah"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} disabled={isLoading}>
                  Batal
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Buat Pesanan"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
