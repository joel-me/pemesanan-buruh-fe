import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useAuth } from "../lib/auth-context"; // Mengimpor hook useAuth
import { getLaborerData } from "../lib/api"; // Mengimpor fungsi untuk mendapatkan data laborer

export default function LaboreDashboard() {
  const { isAuthenticated, getToken, logout } = useAuth();
  const [laborerData, setLaborerData] = useState<any>(null); // Data laborer
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Arahkan ke halaman login jika tidak terautentikasi
    }

    const fetchLaborerData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getToken();
        if (!token) {
          throw new Error("Token tidak ditemukan");
        }

        const response = await getLaborerData(token); // Panggil API untuk mendapatkan data laborer
        setLaborerData(response.data); // Pastikan response.data sesuai dengan format yang diharapkan
      } catch (err) {
        setError("Gagal memuat data laborer.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLaborerData();
  }, [isAuthenticated, navigate, getToken]);

  const handleLogout = () => {
    logout(); // Logout dan bersihkan token
    navigate("/login"); // Arahkan kembali ke halaman login
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Dashboard Laborer</h1>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="text-center">
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {laborerData ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold">Nama: {laborerData.name}</h3>
                    <p>Keahlian: {laborerData.skill}</p>
                    <p>Status: {laborerData.status}</p>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p>No data available</p>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
