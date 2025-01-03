import React, { useEffect, useState, useContext } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { AuthContext } from '../../components/context/AuthContext';

const Home = () => {
  const [transactionStats, setTransactionStats] = useState({
    newOrders: 0,
    readyToShip: 0,
    totalSales: 0
  });
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchTransactionStats = async () => {
      try {
        const response = await axios.get(`${apiUrl}/transaction/seller`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const stats = response.data.transactionStatuses.reduce((acc, transaction) => {
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
        }, { newOrders: 0, readyToShip: 0, totalSales: 0 });

        setTransactionStats(stats);
      } catch (error) {
        console.error('Error fetching transaction stats:', error);
      }
    };

    fetchTransactionStats();
  }, [token, apiUrl]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="col-span-1 md:col-span-3">
        <h1 className="text-2xl font-bold mb-4">Penting Hari Ini</h1>
        <p className="mb-4">Aktivitas Penting Yang Harus Dilakukan</p>
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Pesanan Baru', value: transactionStats.newOrders },
              { label: 'Siap Terkirim', value: transactionStats.readyToShip },
              { label: 'Chat Baru', value: 0 },
              { label: 'Total Sales', value: transactionStats.totalSales }
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">{item.label}</h2>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Statistik Toko</h2>
        <p className="mb-4">Update Terakhir: 1 November 2024 20:18 WIB</p>
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-300">
            {['Potensi Penjualan', 'Produk Dilihat', 'Produk terjual'].map((item, index) => (
              <div key={index} className="p-4">
                <h3 className="text-lg font-semibold">{item}</h3>
                <p className="text-2xl font-bold">{item === 'Potensi Penjualan' ? 'Rp.0,00' : '0'}</p>
                <p className="text-red-500">-100% Dari Hari Sebelumnya</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Cek Keadaan Produkmu</h2>
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 divide-x divide-gray-300">
              <div className="col-span-1 p-4">
                <p>Perlu Dipromosikan</p>
              </div>
              <div className="col-span-4 p-4">
                {/* Konten tambahan bisa ditambahkan di sini */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifikasi Section */}
      <div className="col-span-1 border-l-2 border-gray-300 pl-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Notifikasi</h2>
          {Array(5).fill('Produk Yang Anda Jual Basi').map((notif, index) => (
            <div key={index} className="flex items-center mb-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-2" />
              <p>{notif}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
