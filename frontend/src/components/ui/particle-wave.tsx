'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  z: number
  baseY: number
}

export default function ParticleWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rows = 30
    const cols = 60
    const spacing = 50

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const init = () => {
      resize()
      particlesRef.current = []
      for (let z = 0; z < rows; z++) {
        for (let x = 0; x < cols; x++) {
          particlesRef.current.push({
            x: x * spacing - (cols * spacing) / 2,
            z: z * spacing,
            baseY: 150,
          })
        }
      }
    }

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX - window.innerWidth / 2) * 0.1,
        y: (e.clientY - window.innerHeight / 2) * 0.1,
      }
    }

    const animate = () => {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      timeRef.current += 0.02

      const fov = 350
      const viewerDistance = 250
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const mouse = mouseRef.current
      const time = timeRef.current
      const particles = particlesRef.current

      for (let z = 0; z < rows; z++) {
        ctx.beginPath()
        let isFirstPoint = true

        for (let x = 0; x < cols; x++) {
          const i = z * cols + x
          const p = particles[i]
          if (!p) continue

          const waveX = Math.sin((p.x + mouse.x * 20) * 0.005 + time) * 45
          const waveZ = Math.cos((p.z + mouse.y * 20) * 0.01 + time) * 45
          const currentY = p.baseY + waveX + waveZ

          const z3d = p.z + viewerDistance
          if (z3d <= 0) continue

          const scale = fov / z3d
          const projX = p.x * scale + centerX
          const projY = currentY * scale + centerY

          if (isFirstPoint) {
            ctx.moveTo(projX, projY)
            isFirstPoint = false
          } else {
            ctx.lineTo(projX, projY)
          }

          const alphaPoint = Math.max(0, 1 - p.z / (rows * spacing))
          ctx.fillStyle = `rgba(245, 158, 11, ${alphaPoint * 0.6})`
          ctx.fillRect(projX - 1, projY - 1, 2, 2)
        }

        const alphaLine = Math.max(0, 1 - z / rows)
        ctx.strokeStyle = `rgba(245, 158, 11, ${alphaLine * 0.25})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    init()
    animate()

    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen z-0 pointer-events-none opacity-80"
    />
  )
}
