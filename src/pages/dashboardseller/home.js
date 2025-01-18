import React, { useEffect, useState, useContext } from 'react';
import { ExclamationTriangleIcon, ChartBarIcon, EyeIcon, ShoppingCartIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../components/context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StatCard = ({ label, value, icon: Icon, loading, trend }) => (
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
      <Icon className="w-6 h-6 text-blue-500" />
    </div>
    {loading ? (
      <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
    ) : (
      <>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            <ArrowTrendingUpIcon className={`w-4 h-4 mr-1 ${trend < 0 ? 'transform rotate-180' : ''}`} />
            <span>{Math.abs(trend)}% dari kemarin</span>
          </div>
        )}
      </>
    )}
  </div>
);

const Home = () => {
  const [stats, setStats] = useState({
    transactions: {
      newOrders: 0,
      readyToShip: 0,
      totalSales: 0,
      newChats: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const transactionResponse = await axios.get(`${apiUrl}/transaction/seller`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const transactionStats = transactionResponse.data.transactionStatuses.reduce((acc, transaction) => {
        switch (transaction.status) {
          case 'Paid':
            acc.newOrders++;
            break;
          case 'Processed':
            acc.readyToShip++;
            break;
          case 'Completed':
            acc.totalSales++;
            break;
          default:
            break;
        }
        return acc;
      }, { newOrders: 0, readyToShip: 0, totalSales: 0, newChats: 0 });

      setStats({
        transactions: transactionStats
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data');
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Set up polling every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token, apiUrl]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="col-span-1">
        <h1 className="text-2xl font-bold mb-4">Penting Hari Ini</h1>
        <p className="mb-4">Aktivitas Penting Yang Harus Dilakukan</p>
        
        {/* Transaction Stats */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Pesanan Baru"
              value={stats.transactions.newOrders}
              icon={ShoppingCartIcon}
              loading={loading}
            />
            <StatCard
              label="Siap Terkirim"
              value={stats.transactions.readyToShip}
              icon={ShoppingCartIcon}
              loading={loading}
            />
            <StatCard
              label="Chat Baru"
              value={stats.transactions.newChats}
              icon={ChartBarIcon}
              loading={loading}
            />
            <StatCard
              label="Total Sales"
              value={stats.transactions.totalSales}
              icon={ChartBarIcon}
              loading={loading}
            />
          </div>
        </div>

        {/* Shop Statistics */}
        <h2 className="text-xl font-bold mb-4">Statistik Toko</h2>
        <p className="mb-4">Update Terakhir: {new Date().toLocaleString('id-ID', { 
          dateStyle: 'long', 
          timeStyle: 'short' 
        })}</p>
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-300">
            <div className="p-4">
              <h3 className="text-lg font-semibold">Total Penjualan</h3>
              {loading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded mt-2"></div>
              ) : (
                <>
                  <p className="text-2xl font-bold">{stats.transactions.totalSales}</p>
                  <p className="text-gray-500">Total Transaksi Selesai</p>
                </>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">Pesanan Baru</h3>
              {loading ? (
                <div className="h-8 bg-gray-200 animate-pulse rounded mt-2"></div>
              ) : (
                <>
                  <p className="text-2xl font-bold">{stats.transactions.newOrders}</p>
                  <p className="text-gray-500">Menunggu Diproses</p>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Product Status */}
        <h2 className="text-xl font-bold mb-4">Cek Keadaan Produkmu</h2>
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 divide-x divide-gray-300">
              <div className="col-span-1 p-4 bg-gray-50">
                <div className="flex items-center">
                  <EyeIcon className="w-5 h-5 text-blue-500 mr-2" />
                  <p className="font-medium">Perlu Dipromosikan</p>
                </div>
              </div>
              <div className="col-span-4 p-4">
                {loading ? (
                  <div className="h-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-gray-600">
                    Belum ada produk yang perlu dipromosikan
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
