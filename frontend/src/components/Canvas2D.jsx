import React, { useRef, useEffect } from 'react'

export default function Canvas2D(){
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = canvas.clientWidth
    let height = canvas.clientHeight
    const DPR = window.devicePixelRatio || 1

    function resize(){
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * DPR)
      canvas.height = Math.floor(height * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    function handleMove(e){
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    function handleLeave(){
      mouseRef.current.x = -1000
      mouseRef.current.y = -1000
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', handleMove)
    canvas.addEventListener('mouseleave', handleLeave)

    let rafId
    let t = 0
    const cx = () => canvas.clientWidth / 2
    const cy = () => canvas.clientHeight / 2

    function draw(){
      t += 0.016
      ctx.clearRect(0, 0, width, height)

      // background
      ctx.fillStyle = '#07132a'
      ctx.fillRect(0, 0, width, height)

      // orbiting colorful circles
      for(let i = 0; i < 6; i++){
        const ang = t * (0.5 + i * 0.12) + i
        const r = 40 + i * 28
        const x = cx() + Math.cos(ang) * r
        const y = cy() + Math.sin(ang) * r
        ctx.beginPath()
        ctx.fillStyle = `hsl(${(i * 60 + t * 45) % 360} 80% 60%)`
        ctx.arc(x, y, 12, 0, Math.PI * 2)
        ctx.fill()
      }

      // draw connecting lines
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for(let i = 0; i < 6; i++){
        const ang = t * (0.5 + i * 0.12) + i
        const r = 40 + i * 28
        const x = cx() + Math.cos(ang) * r
        const y = cy() + Math.sin(ang) * r
        if(i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()

      // mouse follower
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.arc(mx, my, 8 + Math.sin(t * 6) * 3, 0, Math.PI * 2)
      ctx.fill()

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMove)
      canvas.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <div className="canvas-wrap">
      <canvas ref={canvasRef} style={{ width: '100%', height: '420px', display: 'block' }} />
    </div>
  )
}
