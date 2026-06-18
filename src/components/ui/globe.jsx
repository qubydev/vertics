"use client"

import { useEffect, useRef } from "react"
import createGlobe from "cobe"
import { useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => { },
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [34 / 255, 197 / 255, 94 / 255],
  glowColor: [1, 1, 1],
  speed: 0.0015,
  markers: [
    { location: [19.076, 72.8777], size: 0.04, id: "bom1" },
    { location: [1.3521, 103.8198], size: 0.04, id: "sin1" },
    { location: [40.7128, -74.006], size: 0.04, id: "nyc1" },
    { location: [51.5072, -0.1276], size: 0.04, id: "lhr1" },
    { location: [35.6895, 139.6917], size: 0.04, id: "hnd1" },
    { location: [-33.8688, 151.2093], size: 0.04, id: "syd1" },
  ],
}

export function Globe({ className, config = GLOBE_CONFIG }) {
  const canvasRef = useRef(null)
  const phiRef = useRef(0)
  const widthRef = useRef(0)
  const pointerInteracting = useRef(null)
  const pointerInteractionMovement = useRef(0)
  const markersRef = useRef({})

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phiRef.current += config.speed || 0.0015
        const currentPhi = phiRef.current + rs.get()
        state.phi = currentPhi
        state.width = widthRef.current * 2
        state.height = widthRef.current * 2

        const width = widthRef.current
        const height = widthRef.current
        const theta = config.theta || 0
        const radius = width * 0.4
        const centerX = width / 2
        const centerY = height / 2

        config.markers.forEach((marker) => {
          const el = markersRef.current[marker.id]
          if (!el) return

          const lat = marker.location[0] * (Math.PI / 180)
          const lon = marker.location[1] * (Math.PI / 180)

          const x = Math.cos(lat) * Math.sin(lon + currentPhi)
          const y = Math.sin(lat)
          const z = Math.cos(lat) * Math.cos(lon + currentPhi)

          const rotatedY = y * Math.cos(theta) - z * Math.sin(theta)
          const rotatedZ = y * Math.sin(theta) + z * Math.cos(theta)

          const screenX = centerX + x * radius
          const screenY = centerY - rotatedY * radius

          el.style.transform = `translate(${screenX}px, ${screenY}px) translate(-50%, -50%)`

          el.style.opacity = rotatedZ > 0 ? "1" : "0"
        })
      },
    })

    setTimeout(() => (canvasRef.current.style.opacity = "1"), 0)
    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [rs, config])

  return (
    <div className={cn("absolute inset-0 mx-auto aspect-square w-full max-w-150", className)}>
      <canvas
        className={cn("size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]")}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />

      <div className="absolute inset-0 pointer-events-none">
        {config.markers?.map((marker) => (
          <div
            key={marker.id}
            ref={(el) => (markersRef.current[marker.id] = el)}
            className="absolute left-0 top-0 flex items-center justify-center transition-opacity duration-200"
            style={{ opacity: 0 }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}