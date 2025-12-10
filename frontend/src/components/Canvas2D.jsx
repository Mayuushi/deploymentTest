import React, { useRef, useEffect, useState } from 'react'
import photoSrc from '../resources/594052605_3456729147812898_2650051124724989210_n.jpg'

// Small 5x5 pixel font for characters used in "DED GEYM"
const PIXEL_FONT = {
  D: [
    [1,1,1,0,0],
    [1,0,0,1,0],
    [1,0,0,1,0],
    [1,0,0,1,0],
    [1,1,1,0,0]
  ],
  E: [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1]
  ],
  G: [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,1,1,1],
    [1,0,0,0,1],
    [0,1,1,1,1]
  ],
  Y: [
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0]
  ],
  M: [
    [1,0,0,0,1],
    [1,1,0,1,1],
    [1,0,1,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  ' ': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ]
}

export default function Canvas2D(){
  const canvasRef = useRef(null)
  const [showPhoto, setShowPhoto] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const imgRef = useRef(new Image())

  useEffect(() => {
    const img = imgRef.current
    img.src = photoSrc
    img.onload = () => setImgLoaded(true)
  }, [])

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

    resize()
    window.addEventListener('resize', resize)

    let raf
    let t0 = performance.now()

    // animation state
    let animStart = null // timestamp when photo reveal started

    function drawPixelSkull(ctx, cx, cy, scale){
      // 8x8 skull pattern (1 = filled)
      const skull = [
        [0,0,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1],
        [1,1,0,1,1,0,1,1],
        [1,1,1,1,1,1,1,1],
        [1,1,0,1,1,0,1,1],
        [0,1,1,0,0,1,1,0],
        [0,0,1,1,1,1,0,0]
      ]
      const px = Math.floor(scale)
      ctx.save()
      ctx.translate(cx, cy)
      for(let y=0;y<8;y++){
        for(let x=0;x<8;x++){
          if(skull[y][x]){
            ctx.fillStyle = '#ffffff'
            ctx.fillRect((x-4)*px*1.2, (y-4)*px*1.2, px*1.2, px*1.2)
            // darker outline
            ctx.strokeStyle = '#000'
            ctx.lineWidth = Math.max(1, px*0.08)
            ctx.strokeRect((x-4)*px*1.2, (y-4)*px*1.2, px*1.2, px*1.2)
          }
        }
      }
      ctx.restore()
    }

    function drawPixelText(ctx, text, x, y, pixelSize, color){
      ctx.save()
      ctx.translate(x, y)
      for(let i=0;i<text.length;i++){
        const ch = text[i].toUpperCase()
        const pat = PIXEL_FONT[ch] || PIXEL_FONT[' ']
        for(let row=0; row<pat.length; row++){
          for(let col=0; col<pat[row].length; col++){
            if(pat[row][col]){
              ctx.fillStyle = color
              ctx.fillRect(i*(pixelSize*6) + col*pixelSize, row*pixelSize, pixelSize, pixelSize)
            }
          }
        }
      }
      ctx.restore()
    }

    function render(now){
      const elapsed = (now - t0) / 1000
      ctx.clearRect(0,0,width,height)

      // background
      ctx.fillStyle = '#07132a'
      ctx.fillRect(0,0,width,height)

      // decorative cute clouds (soft)
      ctx.fillStyle = 'rgba(255,255,255,0.03)'
      for(let i=0;i<5;i++){
        const cx = (i/5)*width + Math.sin(elapsed*0.2 + i)*20
        const cy = 60 + Math.cos(elapsed*0.15 + i)*10
        ctx.beginPath()
        ctx.ellipse(cx, cy, 60, 24, 0, 0, Math.PI*2)
        ctx.fill()
      }

      // if photo not shown yet, show a subtle placeholder box
      if(!showPhoto){
        const w = Math.min(420, width - 80)
        const h = Math.min(300, height - 160)
        const x = (width - w)/2
        const y = (height - h)/2
        ctx.fillStyle = 'rgba(255,255,255,0.02)'
        ctx.fillRect(x, y, w, h)
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'
        ctx.strokeRect(x, y, w, h)
      }

      // photo reveal animation
      if(showPhoto && imgLoaded){
        if(animStart === null) animStart = now
        const a = Math.min(1, (now - animStart) / 600)
        const ease = a < 0.5 ? 2*a*a : -1 + (4-2*a)*a // simple ease
        const w = Math.min(420, width - 80)
        const h = Math.min(300, height - 160)
        const cx = width/2
        const cy = height/2

        // draw photo with scale & rotation
        ctx.save()
        ctx.translate(cx, cy)
        const scale = 0.3 + ease*1.2
        const rot = (1 - ease) * 0.4
        ctx.rotate(rot)
        ctx.globalAlpha = ease
        ctx.drawImage(imgRef.current, -w/2, -h/2, w, h)
        ctx.restore()

        // draw large pixel skull at top-right of photo
        const skullX = cx + w/2 - 40
        const skullY = cy - h/2 + 40
        const skullScale = 8 + ease*6
        // pulsate skull for noticeability
        const pulse = 1 + Math.sin(now/120)*0.06
        drawPixelSkull(ctx, skullX, skullY, skullScale * pulse)

        // draw pixel text under the photo
        const text = 'Ded geym'
        const pixelSize = 6 + Math.round(ease*6)
        drawPixelText(ctx, text, cx - (text.length*(pixelSize*6))/2, cy + h/2 + 12, pixelSize, '#ffdddd')
      }

      raf = requestAnimationFrame(render)
    }

    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [showPhoto, imgLoaded])

  // button styles inline to avoid changing global css
  const btnStyle = {
    padding: '12px 20px',
    borderRadius: '14px',
    border: '2px solid rgba(255,255,255,0.12)',
    background: 'linear-gradient(135deg,#ffd2e0,#ffd9a8)',
    boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
    fontWeight: 700,
    cursor: 'pointer',
    color: '#2b2b2b',
    fontFamily: 'monospace',
    transform: 'translateZ(0)'
  }

  const containerStyle = { position: 'relative' }

  return (
    <div style={containerStyle}>
      <div style={{ position: 'absolute', right: 18, top: 12, zIndex: 20 }}>
        <button style={btnStyle} onClick={() => setShowPhoto(true)}>💖 Click me</button>
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '520px', display: 'block', borderRadius: 8 }} />
    </div>
  )
}

