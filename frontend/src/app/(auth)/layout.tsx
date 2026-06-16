import ParticleWave from '@/components/ui/particle-wave'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg-void)]">
      <ParticleWave />
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {children}
      </div>
    </div>
  )
}
