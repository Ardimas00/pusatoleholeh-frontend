import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

// Atur root element untuk modal
Modal.setAppElement("#root");

function AuthPage() {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // State untuk menyimpan pilihan

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRole(null); // Reset pilihan ketika modal ditutup
  };

  const handleSubmit = () => {
    if (selectedRole === "user") {
      navigate("/register");
    } else if (selectedRole === "seller") {
      navigate("/register-seller");
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl">
        <div className="flex flex-col md:flex-row">
          {/* Bagian Kiri - Form */}
          <div className="w-full md:w-1/2 p-6">
            <div className="flex items-center mb-4">
              <img
                src="/logo.png"
                alt="PusatOlehOleh Logo"
                className="h-8 w-8 mr-2"
              />
              <h1 className="text-lg font-bold">PusatOlehOleh</h1>
            </div>
            <h2 className="text-xl font-bold mb-2 pt-3">
              Masuk untuk eksplor oleh-oleh pilihan Nusantara!
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Belum punya akun?{" "}
              <button
                onClick={openModal}
                className="text-red-500 font-semibold"
              >
                Daftar sekarang!
              </button>
            </p>

            <form className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 pt-3">
                  Nama
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Masukkan password"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="text-right">
                <button
                  onClick={() => alert("Navigasi ke halaman lupa password")}
                  className="text-red-500 text-sm"
                >
                  Lupa password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-custom-red transition duration-300 font-avenir font-medium"
              >
                Masuk
              </button>
            </form>

            <div className="mt-4 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">atau</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <img
                src="/google-icon.png"
                alt="Google"
                className="h-5 w-5 mr-2"
              />
              Masuk dengan Google
            </button>

            <footer className="mt-4 text-center text-xs text-gray-500 pt-10">
              <p>© 2024 PusatOlehOleh. All Rights Reserved</p>
            </footer>
          </div>

          {/* Bagian Kanan - Gambar */}
          <div className="hidden md:block md:w-1/2">
            <img
              className="object-cover w-full h-full"
              src="/placeholder.jpg"
              alt="Placeholder"
            />
          </div>
        </div>
      </div>

      {/* Modal untuk pertanyaan "Mau daftar sebagai apa?" */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Pilih Tipe Akun"
        className="modal bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-20 flex flex-col items-center justify-center"
        overlayClassName="overlay bg-black bg-opacity-50 fixed inset-0 flex justify-center items-center"
      >
        <h2 className="text-lg font-bold mb-4 text-center">
          Mau daftar sebagai apa?
        </h2>
        <h3 className="text-sm font-normal mb-4 text-center">
          Pilih tipe akunmu, yuk!
        </h3>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setSelectedRole("user")}
            className={`px-4 py-2 rounded-md transition ${
              selectedRole === "user"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setSelectedRole("seller")}
            className={`px-4 py-2 rounded-md transition ${
              selectedRole === "seller"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Seller
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-custom-red transition"
          disabled={!selectedRole} // Disable tombol jika belum ada pilihan
        >
          Submit
        </button>
      </Modal>
    </div>
  );
}

export default AuthPage;
