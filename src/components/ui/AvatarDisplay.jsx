import cowokImg from '../../gambar/cowok.png'
import cewekImg from '../../gambar/cewek.png'

export default function AvatarDisplay({ type = 'boy1', size = 'md', showLevel, level, gender }) {
  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  }

  // Debug log lengkap
  console.log('🎭 Avatar Debug:', { 
    type, 
    gender, 
    isFemale: gender === 'female',
    typeCheck: type === 'girl1',
    allProps: { type, gender }
  })

  // Tentukan gambar - cek semua kemungkinan
  let avatarSrc = cowokImg // default cowok
  
  // Cek gender string (case-insensitive)
  if (gender && gender.toString().toLowerCase() === 'female') {
    avatarSrc = cewekImg
    console.log('✅ Using cewek.png (by gender)')
  } else if (type && (type === 'girl1' || type === 'girl2' || type.includes('girl'))) {
    avatarSrc = cewekImg
    console.log('✅ Using cewek.png (by type)')
  } else {
    console.log('ℹ️ Using cowok.png (default)')
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <div className={`${sizes[size]} rounded-full overflow-hidden shadow-lg`}>
        <img 
          src={avatarSrc} 
          alt="Avatar" 
          className="w-full h-full object-cover object-center"
          style={{ objectPosition: '50% 30%' }}
        />
      </div>

      {showLevel && level && (
        <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-black border-2 border-white shadow">
          {level}
        </div>
      )}
    </div>
  )
}
