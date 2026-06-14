"use client"

import { useState, useEffect } from "react"
import { Download, X } from "lucide-react"

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // Check if user dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      return
    }

    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Show prompt after 3 seconds
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-2xl p-4 border-2 border-blue-400">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <Download className="h-6 w-6 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Install BusUndo App</h3>
            <p className="text-sm text-blue-100 mb-3">
              Get the full app experience! Install BusUndo on your phone for quick access, offline support, and push notifications.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-white text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Install Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-blue-500/30">
          <div className="flex items-center justify-between text-xs text-blue-200">
            <span>✓ Works offline</span>
            <span>✓ Fast & secure</span>
            <span>✓ No app store needed</span>
          </div>
        </div>
      </div>
    </div>
  )
}
