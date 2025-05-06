import React, { useEffect, useState } from "react";
import { getAllLaborers } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import { Card } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useNavigate } from "react-router-dom";

export default function LaborerListPage() {
  const { getToken } = useAuth();
  const [laborers, setLaborers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLaborers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) throw new Error("Token tidak ditemukan");
        const response = await getAllLaborers(token);
        setLaborers(response.data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data buruh");
      } finally {
        setLoading(false);
      }
    };
    fetchLaborers();
  }, [getToken]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Daftar Buruh</h1>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Memuat data buruh...</p>
            </div>
          ) : (
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Nama</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Alamat</th>
                  <th className="border px-4 py-2">No. Telepon</th>
                  <th className="border px-4 py-2">Umur</th>
                  <th className="border px-4 py-2">Keterampilan</th>
                </tr>
              </thead>
              <tbody>
                {laborers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      Tidak ada buruh ditemukan.
                    </td>
                  </tr>
                ) : (
                  laborers.map((b, idx) => (
                    <tr
                      key={b.id || idx}
                      className="cursor-pointer hover:bg-green-50 transition"
                      onClick={() => navigate(`/orders/create?laborerId=${b.id}`)}
                    >
                      <td className="border px-4 py-2">{b.username}</td>
                      <td className="border px-4 py-2">{b.email}</td>
                      <td className="border px-4 py-2">{b.address}</td>
                      <td className="border px-4 py-2">{b.phoneNumber}</td>
                      <td className="border px-4 py-2">{b.age}</td>
                      <td className="border px-4 py-2">
                        {Array.isArray(b.skills) ? b.skills.join(", ") : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
} 