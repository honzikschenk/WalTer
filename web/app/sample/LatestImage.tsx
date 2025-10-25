"use client"

import { useEffect, useState } from 'react'

export default function LatestImage() {
  const [tick, setTick] = useState(0)
  const intervalMs = 10

  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), intervalMs)
    return () => clearInterval(id)
  }, [])

  const src = `/upload?ts=${Date.now()}&n=${tick}`
  return (
    <div>
      <img src={src} alt="Latest upload" />
    </div>
  )
}
