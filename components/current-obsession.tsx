"use client"

import { useState, useEffect } from "react"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"

type ObsessionResponse = {
  obsession: string
  usingFallback?: boolean
  authError?: boolean
  error?: string
  message?: string
}

export function CurrentObsession() {
  const [obsession, setObsession] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState<boolean>(false)
  const [usingFallback, setUsingFallback] = useState<boolean>(false)
  const [authError, setAuthError] = useState<boolean>(false)

  const fetchObsession = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/current-obsession")

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }

      const data: ObsessionResponse = await response.json()

      if (data.error) {
        throw new Error(data.message || data.error)
      }

      setObsession(data.obsession)
      setUsingFallback(!!data.usingFallback)
      setAuthError(!!data.authError)
    } catch (err) {
      console.error("Error fetching current obsession:", err)
      setError(err instanceof Error ? err.message : "Failed to analyze recent activity")
    } finally {
      setLoading(false)
      setRetrying(false)
    }
  }

  useEffect(() => {
    fetchObsession()
  }, [])

  const handleRetry = () => {
    setRetrying(true)
    fetchObsession()
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-green-300">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>analyzing recent activity...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-red-400 text-xs">{error}</span>
        <button
          onClick={handleRetry}
          className="text-green-300 hover:text-green-100 flex items-center gap-1"
          disabled={retrying}
        >
          {retrying ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          <span className="text-xs">retry</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="text-green-300 text-sm">{obsession}</div>
      {usingFallback && (
        <div className="flex items-center gap-1 text-yellow-500 text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>using sample data</span>
        </div>
      )}
    </div>
  )
}
