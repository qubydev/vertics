'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import createGlobe from 'cobe'
import { useSpring } from 'react-spring'
import { useTheme } from './theme-provider'

const analyticsMarkers = [
    { id: 'cdn-iad', location: [38.95, -77.45], region: 'iad1', click: 100 },
    { id: 'cdn-sfo', location: [37.62, -122.38], region: 'sfo1', click: 100 },
    { id: 'cdn-cdg', location: [49.01, 2.55], region: 'cdg1', click: 100 },
    { id: 'cdn-hnd', location: [35.55, 139.78], region: 'hnd1', click: 100 },
    { id: 'cdn-syd', location: [-33.95, 151.18], region: 'syd1', click: 100 },
    { id: 'cdn-gru', location: [-23.43, -46.47], region: 'gru1', click: 100 },
    { id: 'cdn-sin', location: [1.36, 103.99], region: 'sin1', click: 100 },
    { id: 'cdn-arn', location: [59.65, 17.93], region: 'arn1', click: 100 },
    { id: 'cdn-dub', location: [53.43, -6.25], region: 'dub1', click: 100 },
    { id: 'cdn-bom', location: [19.09, 72.87], region: 'bom1', click: 100 },
]

const globeThemes = {
    light: {
        dark: 0,
        mapBrightness: 10,
        markerColor: [0, 0, 0],
        baseColor: [1, 1, 1],
        glowColor: [0.94, 0.93, 0.91],
    },
    dark: {
        dark: 1,
        mapBrightness: 4.2,
        markerColor: [1, 1, 1],
        baseColor: [0.72, 0.72, 0.76],
        glowColor: [0.12, 0.12, 0.14],
    },
}

export default function Globe() {
    const canvasRef = useRef(null)
    const { resolvedTheme } = useTheme()
    const initialResolvedTheme = useRef(resolvedTheme)
    const [clickTraffic, setClickTraffic] = useState(() =>
        analyticsMarkers.reduce((acc, marker) => {
            acc[marker.region] = marker.click
            return acc
        }, {})
    )

    const [clickTrends, setClickTrends] = useState(() =>
        analyticsMarkers.reduce((acc, marker) => {
            acc[marker.region] = 0
            return acc
        }, {})
    )

    const trendTimestamps = useRef({})
    const MIN_TREND_DURATION = 1500

    useEffect(() => {
        const interval = setInterval(() => {
            setClickTraffic((traffic) => {
                const newTraffic = Object.fromEntries(
                    Object.entries(traffic).map(([region, clicks]) => {
                        let delta =
                            Math.random() < 0.1
                                ? Math.floor(Math.random() * 50) - 25
                                : Math.floor(Math.random() * 7) - 3

                        if (delta === 0) delta = Math.random() < 0.5 ? 1 : -1

                        return [region, Math.max(1, clicks + delta)]
                    })
                )

                setClickTrends((prevTrends) =>
                    Object.fromEntries(
                        Object.entries(newTraffic).map(([region, newClicks]) => {
                            const newTrend = newClicks - (traffic[region] || 0)
                            const now = Date.now()
                            const lastUpdate = trendTimestamps.current[region] || 0

                            if (now - lastUpdate > MIN_TREND_DURATION) {
                                trendTimestamps.current[region] = now
                                return [region, newTrend]
                            }

                            return [region, prevTrends[region] || 0]
                        })
                    )
                )

                return newTraffic
            })
        }, 250)
        return () => clearInterval(interval)
    }, [])

    const pointerInteracting = useRef(null)
    const dragOffset = useRef({ phi: 0, theta: 0 })
    const velocity = useRef({ phi: 0, theta: 0 })
    const lastPointer = useRef(null)
    const phiOffsetRef = useRef(0)
    const thetaOffsetRef = useRef(0)

    const handlePointerDown = useCallback((e) => {
        pointerInteracting.current = { x: e.clientX, y: e.clientY }
        lastPointer.current = null
        if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing'
    }, [])

    const handlePointerMove = useCallback((e) => {
        if (pointerInteracting.current !== null) {
            const deltaX = e.clientX - pointerInteracting.current.x
            const deltaY = e.clientY - pointerInteracting.current.y
            dragOffset.current = { phi: deltaX / 300, theta: deltaY / 1000 }

            const now = Date.now()
            if (lastPointer.current) {
                const dt = Math.max(now - lastPointer.current.t, 1)
                const maxVelocity = 0.15
                velocity.current = {
                    phi: Math.max(
                        -maxVelocity,
                        Math.min(
                            maxVelocity,
                            ((e.clientX - lastPointer.current.x) / dt) * 0.3,
                        ),
                    ),
                    theta: Math.max(
                        -maxVelocity,
                        Math.min(
                            maxVelocity,
                            ((e.clientY - lastPointer.current.y) / dt) * 0.08,
                        ),
                    ),
                }
            }
            lastPointer.current = { x: e.clientX, y: e.clientY, t: now }
        }
    }, [])

    const handlePointerUp = useCallback(() => {
        if (pointerInteracting.current !== null) {
            phiOffsetRef.current += dragOffset.current.phi
            thetaOffsetRef.current += dragOffset.current.theta
            dragOffset.current = { phi: 0, theta: 0 }
            lastPointer.current = null
        }
        pointerInteracting.current = null
        if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
    }, [])

    useEffect(() => {
        window.addEventListener('pointermove', handlePointerMove, { passive: true })
        window.addEventListener('pointerup', handlePointerUp, { passive: true })
        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerup', handlePointerUp)
        }
    }, [handlePointerMove, handlePointerUp])

    const [spring, api] = useSpring(() => ({
        theta: 0,
        dark: 0,
        mapBrightness: 10,
        mr: 0,
        mg: 0,
        mb: 0,
        br: 1,
        bg: 1,
        bb: 1,
        gr: 0.94,
        gg: 0.93,
        gb: 0.91,
        ar: 0.3,
        ag: 0.45,
        ab: 0.85,
        markerSize: 0.012,
        markerElevation: 0,
        config: { mass: 1, tension: 120, friction: 20 },
    }))

    const springRef = useRef(spring)
    useEffect(() => {
        springRef.current = spring
    }, [spring])

    useEffect(() => {
        const theme = globeThemes[resolvedTheme]

        api.start({
            dark: theme.dark,
            mapBrightness: theme.mapBrightness,
            mr: theme.markerColor[0],
            mg: theme.markerColor[1],
            mb: theme.markerColor[2],
            br: theme.baseColor[0],
            bg: theme.baseColor[1],
            bb: theme.baseColor[2],
            gr: theme.glowColor[0],
            gg: theme.glowColor[1],
            gb: theme.glowColor[2],
        })
    }, [api, resolvedTheme])

    useEffect(() => {
        if (!canvasRef.current) return
        let phi = 0
        const theme = globeThemes[initialResolvedTheme.current]
        const width = canvasRef.current.offsetWidth
        const globe = createGlobe(canvasRef.current, {
            width,
            height: width,
            devicePixelRatio: Math.min(window.devicePixelRatio, 2),
            phi: 0,
            theta: 0,
            dark: theme.dark,
            diffuse: 1.5,
            mapSamples: 16000,
            mapBrightness: theme.mapBrightness,
            baseColor: theme.baseColor,
            markerColor: theme.markerColor,
            glowColor: theme.glowColor,
            markerElevation: 0,
            markers: analyticsMarkers.map((m) => ({
                location: m.location,
                size: 0.05,
                id: m.id,
            })),
            scale: 1.2
        })

        let frame
        const animate = () => {
            const s = springRef.current
            phi += 0.005

            if (
                Math.abs(velocity.current.phi) > 0.0001 ||
                Math.abs(velocity.current.theta) > 0.0001
            ) {
                phiOffsetRef.current += velocity.current.phi
                thetaOffsetRef.current += velocity.current.theta
                velocity.current.phi *= 0.95
                velocity.current.theta *= 0.95
            }

            const thetaMin = -0.4
            const thetaMax = 0.4
            if (thetaOffsetRef.current < thetaMin) {
                thetaOffsetRef.current += (thetaMin - thetaOffsetRef.current) * 0.1
            } else if (thetaOffsetRef.current > thetaMax) {
                thetaOffsetRef.current += (thetaMax - thetaOffsetRef.current) * 0.1
            }

            globe.update({
                phi: phi + phiOffsetRef.current + dragOffset.current.phi,
                theta: s.theta.get() + thetaOffsetRef.current + dragOffset.current.theta,
                dark: s.dark.get(),
                mapBrightness: s.mapBrightness.get(),
                baseColor: [s.br.get(), s.bg.get(), s.bb.get()],
                markerColor: [s.mr.get(), s.mg.get(), s.mb.get()],
                glowColor: [s.gr.get(), s.gg.get(), s.gb.get()],
                markerElevation: s.markerElevation.get(),
                markers: analyticsMarkers.map((m) => ({
                    location: m.location,
                    size: 0.05,
                    id: m.id,
                })),
            })
            frame = requestAnimationFrame(animate)
        }
        animate()
        return () => {
            cancelAnimationFrame(frame)
            globe.destroy()
        }
    }, [])

    return (
        <div
            className='relative flex items-center justify-center w-full aspect-square'
            onPointerDown={handlePointerDown}
        >
            <style>{`
                @keyframes compactWave {
                    0% {
                        transform: scale(0.3);
                        opacity: 0.9;
                    }
                    100% {
                        transform: scale(1.3);
                        opacity: 0;
                    }
                }
                .wave-effect-compact {
                    animation: compactWave 2.2s cubic-bezier(0.1, 0.4, 0.2, 1) infinite;
                }
            `}</style>
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ cursor: 'grab' }}
            />
            {analyticsMarkers.map((m) => {
                return (
                    <div
                        key={m.id}
                        className='select-none pointer-events-none transform translate-x-[-50%] translate-y-[-50%] w-[6.4%] aspect-square'
                        style={{
                            position: "absolute",
                            positionAnchor: `--cobe-${m.id}`,
                            left: "anchor(right)",
                            top: "anchor(top)",
                            opacity: `var(--cobe-visible-${m.id}, 0)`,
                            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
                            transition: 'opacity 0.3s ease, filter 0.3s ease',
                        }}
                    >
                        <div className="relative flex items-center justify-center w-full h-full">
                            <div className="absolute w-full h-full rounded-full border border-foreground wave-effect-compact" style={{ animationDelay: '0s' }} />
                            <div className="absolute w-full h-full rounded-full border border-foreground wave-effect-compact" style={{ animationDelay: '0.7s' }} />
                            <div className="absolute w-full h-full rounded-full border border-foreground wave-effect-compact" style={{ animationDelay: '1.4s' }} />
                            <div className="absolute w-2/3 h-2/3 rounded-full bg-foreground/20 animate-pulse" />
                            <div className="relative w-1/3 h-1/3 rounded-full bg-foreground animate-pulse" />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
