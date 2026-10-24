import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, BookOpen, Target, Award } from 'lucide-react'

export default function CaseStudyIntro() {
  const { caseId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { groupName, members, caseData } = location.state || {}

  if (!caseData) {
    navigate('/student/group-mode')
    return null
  }

  // Full story untuk setiap studi kasus
  const fullStories = {
    'case-1': {
      title: 'Kisah Rani: Ketika Pikiran Negatif Menghadang',
      story: `Rani adalah siswi kelas 8 yang rajin dan bertanggung jawab. Suatu hari, gurunya menunjuk Rani untuk mempresentasikan hasil diskusi kelompok di depan kelas.

Rani sebenarnya sudah menyiapkan materi dengan sangat rapi. Slide presentasinya menarik, poin-poinnya jelas, dan ia sudah berlatih di rumah. Namun, ketika hari presentasi semakin dekat, pikiran-pikiran ini mulai muncul di benak Rani:

• "Nanti aku pasti salah bicara dan ditertawakan teman-teman..."
• "Teman-temanku lebih pintar dariku, mereka pasti tahu aku tidak layak presentasi..."
• "Bagaimana kalau aku lupa semua materinya di depan?"

Akibat pikiran-pikiran ini, tangannya mulai terasa dingin, suaranya gemetar saat mencoba latihan, dan perutnya terasa mual. Rani bahkan berpikir untuk meminta temannya menggantikan dirinya, padahal ia sudah bekerja keras mempersiapkan presentasi.

Di sinilah masalahnya: Rani tidak kekurangan kemampuan, tapi ia terjebak dalam pikiran negatif yang membuatnya tidak percaya diri.`,
      missions: [
        { id: 1, title: 'Detektif Pikiran', desc: 'Identifikasi pikiran negatif Rani', icon: '🔍' },
        { id: 2, title: 'Cari Kekuatan', desc: 'Temukan bukti kemampuan Rani', icon: '💪' },
        { id: 3, title: 'Ubah Pikiran', desc: 'Ganti pikiran negatif jadi positif', icon: '🔄' },
        { id: 4, title: 'Pilih Strategi', desc: 'Tentukan cara bantu Rani', icon: '🎯' }
      ],
      challenge: 'Setiap anggota praktik berbicara 30 detik dengan percaya diri'
    },
    'case-2': {
      title: 'Kisah Budi: Ketika Kerja Kelompok Tidak Adil',
      story: `Budi adalah siswa yang bertanggung jawab. Ketika guru memberikan tugas kelompok, ia langsung bersemangat membagi tugas dengan teman-temannya.

Namun, setelah beberapa hari, Budi menyadari bahwa hanya dialah yang benar-benar bekerja. Teman-temannya:
• Lebih suka bermain HP saat waktu diskusi
• Berbicara hal lain yang tidak berhubungan dengan tugas
• Berjanji akan mengerjakan bagiannya, tapi tidak pernah mengirim
• Mengandalkan Budi untuk mengerjakan semuanya

Budi mulai merasa kesal, lelah, dan berpikir:
• "Kenapa aku harus mengerjakan semuanya sendirian?"
• "Mereka tidak menghargai usahaku..."
• "Ini tidak adil!"

Namun, Budi bingung harus bagaimana. Ia takut jika menegur temannya, mereka akan marah atau malah keluar dari kelompok. Tapi jika dibiarkan, Budi terus merasa dimanfaatkan.`,
      missions: [
        { id: 1, title: 'Detektif Masalah', desc: 'Identifikasi apa yang salah dalam kelompok', icon: '🔍' },
        { id: 2, title: 'Pahami Perasaan', desc: 'Kenali perasaan Budi dan teman-temannya', icon: '💭' },
        { id: 3, title: 'Komunikasi Asertif', desc: 'Cara menyampaikan keberatan dengan baik', icon: '💬' },
        { id: 4, title: 'Solusi Bersama', desc: 'Buat kesepakatan yang adil', icon: '🤝' }
      ],
      challenge: 'Simulasi role play: menyampaikan masalah dengan asertif'
    },
    'case-3': {
      title: 'Kisah Siti: Ketika Merasa Kesepian',
      story: `Siti adalah siswi baru di sekolah. Sudah beberapa minggu ia pindah, tapi ia masih belum punya teman dekat.

Setiap istirahat, Siti melihat teman-teman sekelasnya berkumpul, tertawa bersama, dan bermain. Sementara ia duduk sendirian di bangkunya, berpura-pura sibuk dengan buku atau HP-nya.

Siti sudah mencoba:
• Tersenyum pada teman-temannya → tapi mereka hanya tersenyum sekilas lalu pergi
• Mendekati grup yang sedang ngobrol → tapi sepertinya mereka tidak terlalu memperhatikan Siti
• Mengajak teman sebangku berbicara → tapi pembicaraan cepat selesai

Pikiran-pikiran ini mulai muncul di benak Siti:
• "Tidak ada yang menyukaiku..."
• "Aku membosankan, makanya tidak ada yang mau berteman denganku..."
• "Lebih baik aku sendirian saja..."

Siti mulai merasa kesepian, sedih, dan kehilangan semangat untuk ke sekolah. Padahal, mungkin saja teman-temannya tidak bermaksud mengabaikan Siti, tapi Siti sudah terlanjur berpikir negatif tentang dirinya sendiri.`,
      missions: [
        { id: 1, title: 'Detektif Pikiran', desc: 'Identifikasi pikiran negatif Siti', icon: '🔍' },
        { id: 2, title: 'Cek Fakta', desc: 'Bedakan fakta vs asumsi', icon: '📋' },
        { id: 3, title: 'Keterampilan Sosial', desc: 'Cara memulai dan menjaga pertemanan', icon: '🤝' },
        { id: 4, title: 'Rencana Aksi', desc: 'Buat langkah konkret untuk Siti', icon: '📝' }
      ],
      challenge: 'Praktik memulai percakapan dengan teman baru'
    }
  }

  const storyData = fullStories[caseId] || fullStories['case-1']

  function handleStart() {
    navigate(`/student/group-map/${caseId}`, {
      state: {
        groupName,
        members,
        caseData
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-28">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 -mx-4 px-4 pt-6 pb-6 mb-5 sticky top-0 z-20 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/student/group-mode')}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1">
              <h1 className="text-white text-base font-black leading-tight">Penjelasan Studi Kasus</h1>
              <div className="flex items-center gap-2 mt-1">
                <Users size={12} className="text-purple-100" />
                <span className="text-purple-100 text-xs font-bold">{groupName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Story Card */}
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800">{storyData.title}</h2>
              <p className="text-xs text-purple-600">{caseData.category}</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            {storyData.story.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-xs text-slate-700 leading-relaxed mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Missions Overview */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} className="text-purple-600" />
            <h3 className="text-sm font-black text-slate-800">4 Misi yang Akan Dikerjakan</h3>
          </div>

          <div className="space-y-2">
            {storyData.missions.map((mission) => (
              <div
                key={mission.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center text-2xl shrink-0">
                  {mission.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-800 mb-0.5">
                    📍 Misi {mission.id}: {mission.title}
                  </p>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {mission.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Info */}
        <div className="bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-300 rounded-2xl p-4 shadow-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Award size={18} className="text-orange-700" />
            <h3 className="text-sm font-black text-orange-800">🏁 Challenge Final</h3>
          </div>
          <p className="text-xs text-orange-700 leading-relaxed">
            {storyData.challenge}
          </p>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 mb-4">
          <p className="text-xs text-yellow-800 leading-relaxed">
            💡 <strong>Tips untuk Kelompok:</strong><br />
            • Baca cerita bersama-sama dengan seksama<br />
            • Diskusikan setiap pertanyaan sebelum menulis jawaban<br />
            • Dengarkan pendapat semua anggota<br />
            • Catat hal-hal penting dari cerita
          </p>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          <h3 className="text-xs font-black text-slate-800 mb-2">👥 Anggota Kelompok:</h3>
          <div className="grid grid-cols-2 gap-2">
            {members.map((member, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-purple-50 rounded-lg px-3 py-2">
                <span className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-[10px]">
                  {idx + 1}
                </span>
                <span className="truncate">{member}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button - Inline dalam content */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-base hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 mb-6"
        >
          <span>🗺️</span>
          <span>Mulai Petualangan!</span>
          <span>→</span>
        </button>

      </div>
    </div>
  )
}
