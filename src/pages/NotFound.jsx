import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-indigo-600 flex flex-col items-center justify-center p-5 text-center">
      <div className="animate-float mb-6">
        <span className="text-8xl">🗺️</span>
      </div>
      <h1 className="text-4xl font-black text-white mb-2">404</h1>
      <h2 className="text-2xl font-bold text-blue-200 mb-3">Halaman Tidak Ditemukan</h2>
      <p className="text-blue-300 mb-8 max-w-xs">
        Sepertinya petualanganmu membawamu ke tempat yang salah. Mari kembali ke jalur yang benar!
      </p>
      <button
        onClick={() => navigate('/')}
        className="btn-primary flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50"
      >
        <Home size={18} />
        Kembali ke Beranda
      </button>
    </div>
  )
}
