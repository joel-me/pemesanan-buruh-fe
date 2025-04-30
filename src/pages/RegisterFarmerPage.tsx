"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Card } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Loader2 } from "lucide-react"
import { registerFarmer } from "../lib/api"

export default function RegisterFarmerPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    address: "", // Added address
    phoneNumber: "",
    landArea: "",
    cropType: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok!")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await registerFarmer({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        address: formData.address, // Passing address
        phoneNumber: formData.phoneNumber,
        landArea: Number.parseFloat(formData.landArea),
        cropType: formData.cropType,
      })

      // Store token and user info
      localStorage.setItem("token", response.data.token) // Accessing token from API response
      localStorage.setItem("user", JSON.stringify(response.data.user)) // Accessing user from API response

      // Redirect to dashboard
      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-600 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Pendaftaran Petani</h1>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Nomor Telepon</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landArea">Luas Lahan (Hektar)</Label>
                <Input
                  id="landArea"
                  name="landArea"
                  type="number"
                  step="0.01"
                  value={formData.landArea}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cropType">Jenis Tanaman</Label>
              <Textarea
                id="cropType"
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                placeholder="Contoh: Padi, Jagung, Kedelai"
                required
                disabled={isLoading}
              />
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Daftar"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
