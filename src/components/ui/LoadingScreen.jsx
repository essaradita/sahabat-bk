export default function LoadingScreen({ message = 'Memuat...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500">
      <div className="text-center animate-fade-in">
        {/* Logo */}
        <div className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
          <span className="text-3xl font-black text-blue-700">BK</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-1">Sahabat BK</h1>
        <p className="text-blue-200 text-sm mb-8">Belajar, Bertumbuh, Jadi Versi Terbaik.</p>

        {/* Spinner */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-blue-100 text-sm">{message}</p>
      </div>
    </div>
  )
}
