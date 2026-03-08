import { useState, useEffect } from 'react'
import {
  getUserLocation,
  getCachedLocation,
  getGoogleMapsSearchURL,
  getGoogleMapsDirectionsURL,
  getWhatsAppShareURL,
} from '../lib/location'

/**
 * NearbyDoctors — location-aware doctor finder using Google Maps
 * Shows user's detected location, search for ophthalmologists, call/WhatsApp actions
 */
export default function NearbyDoctors({ lang, scanResult }) {
  const [location, setLocation] = useState(getCachedLocation)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!location) {
      fetchLocation()
    }
  }, [])

  const fetchLocation = async () => {
    setLoading(true)
    setError(null)
    try {
      const loc = await getUserLocation()
      setLocation(loc)
    } catch (err) {
      setError(err.code === 1 ? 'permission_denied' : 'unavailable')
    } finally {
      setLoading(false)
    }
  }

  const i = {
    detectingLocation: { en: 'Detecting your location...', hi: 'आपकी लोकेशन खोज रहे हैं...', kn: 'ನಿಮ್ಮ ಸ್ಥಳ ಹುಡುಕುತ್ತಿದೆ...' },
    locationDetected: { en: 'Your Location', hi: 'आपकी लोकेशन', kn: 'ನಿಮ್ಮ ಸ್ಥಳ' },
    findDoctors: { en: 'Find Eye Doctors Nearby', hi: 'पास के आँख के डॉक्टर खोजो', kn: 'ಹತ್ತಿರದ ಕಣ್ಣಿನ ವೈದ್ಯರನ್ನು ಹುಡುಕಿ' },
    findHospitals: { en: 'Find Eye Hospitals', hi: 'आँख का अस्पताल खोजो', kn: 'ಕಣ್ಣಿನ ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ' },
    getDirections: { en: 'Get Directions', hi: 'रास्ता देखो', kn: 'ದಿಕ್ಕುಗಳನ್ನು ಪಡೆಯಿರಿ' },
    shareReport: { en: 'Share Report on WhatsApp', hi: 'WhatsApp पर रिपोर्ट शेयर करो', kn: 'WhatsApp ನಲ್ಲಿ ರಿಪೋರ್ಟ್ ಹಂಚಿ' },
    callNearestPHC: { en: 'Call Nearest PHC', hi: 'नज़दीकी PHC को कॉल करो', kn: 'ಹತ್ತಿರದ PHC ಗೆ ಕರೆ ಮಾಡಿ' },
    enableLocation: { en: 'Enable location to find nearby doctors', hi: 'डॉक्टर खोजने के लिए लोकेशन ऑन करें', kn: 'ವೈದ್ಯರನ್ನು ಹುಡುಕಲು ಸ್ಥಳ ಸಕ್ರಿಯಗೊಳಿಸಿ' },
    retry: { en: 'Try Again', hi: 'फिर कोशिश करो', kn: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' },
    openInMaps: { en: 'Open in Google Maps', hi: 'Google Maps में खोलो', kn: 'Google Maps ನಲ್ಲಿ ತೆರೆಯಿರಿ' },
    poweredBy: { en: 'Powered by Google Maps', hi: 'Google Maps द्वारा', kn: 'Google Maps ಮೂಲಕ' },
  }

  const txt = (key) => i[key]?.[lang] || i[key]?.en || key

  // Severity to search query mapping
  const searchQueries = {
    ophthalmologist: 'ophthalmologist eye doctor',
    eyeHospital: 'eye hospital',
    phc: 'primary health centre PHC',
  }

  return (
    <div className="space-y-3">
      {/* Location status */}
      {loading && (
        <div className="card-teal flex items-center gap-3 py-3">
          <div className="w-5 h-5 border-2 border-teal-deep border-t-transparent rounded-full animate-spin shrink-0" />
          <p className="text-caption text-teal-deep font-medium">{txt('detectingLocation')}</p>
        </div>
      )}

      {error && (
        <div className="card-warm bg-amber-light border-amber-warm/20">
          <p className="text-caption text-ink-light mb-2">{txt('enableLocation')}</p>
          <button onClick={fetchLocation} className="btn-teal !py-2 !text-sm gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {txt('retry')}
          </button>
        </div>
      )}

      {location && (
        <>
          {/* Detected location */}
          <div className="card-teal">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-teal-deep rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-teal-deep/70 font-medium">{txt('locationDetected')}</p>
                <p className="font-body font-semibold text-sm text-ink truncate">{location.short || location.display}</p>
                {location.pincode && (
                  <p className="font-mono text-[11px] text-ink-muted mt-0.5">PIN: {location.pincode}</p>
                )}
              </div>
              {/* Refresh location */}
              <button
                onClick={fetchLocation}
                className="w-8 h-8 bg-teal-deep/10 rounded-lg flex items-center justify-center shrink-0 hover:bg-teal-deep/20 transition-colors"
                aria-label="Refresh location"
                disabled={loading}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A6E6E" strokeWidth="2.5"
                  className={loading ? 'animate-spin' : ''}>
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </button>
            </div>
          </div>

          {/* Find doctors on Google Maps */}
          <div className="card-warm space-y-3">
            <h3 className="font-display font-semibold text-ink text-body flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A6E6E" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {txt('findDoctors')}
            </h3>

            {/* Ophthalmologist search */}
            <a
              href={getGoogleMapsSearchURL(location.lat, location.lng, searchQueries.ophthalmologist)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-ivory rounded-xl p-3.5 hover:bg-ivory-dark transition-colors group"
              aria-label={txt('findDoctors')}
            >
              <div className="w-10 h-10 bg-teal-pale rounded-xl flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A6E6E" strokeWidth="2">
                  <ellipse cx="12" cy="12" rx="10" ry="6" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-sm text-ink group-hover:text-teal-deep transition-colors">
                  {txt('findDoctors')}
                </p>
                <p className="text-[11px] text-ink-muted">{txt('openInMaps')}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8A9A" strokeWidth="2" className="shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>

            {/* Eye hospital search */}
            <a
              href={getGoogleMapsSearchURL(location.lat, location.lng, searchQueries.eyeHospital)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-ivory rounded-xl p-3.5 hover:bg-ivory-dark transition-colors group"
              aria-label={txt('findHospitals')}
            >
              <div className="w-10 h-10 bg-amber-light rounded-xl flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E09000" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-sm text-ink group-hover:text-amber-deep transition-colors">
                  {txt('findHospitals')}
                </p>
                <p className="text-[11px] text-ink-muted">{txt('openInMaps')}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8A9A" strokeWidth="2" className="shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>

            {/* Get directions to nearest eye hospital */}
            <a
              href={getGoogleMapsDirectionsURL(location.lat, location.lng, 'eye hospital near me')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-teal w-full gap-2"
              aria-label={txt('getDirections')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              {txt('getDirections')}
            </a>
          </div>

          {/* WhatsApp share with location */}
          {scanResult && (
            <a
              href={getWhatsAppShareURL({
                patientId: scanResult.patientId,
                grade: scanResult.gradeLabel || 'Detected',
                confidence: scanResult.confidence,
                lat: location.lat,
                lng: location.lng,
                locationName: location.short,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full gap-2 !text-mango-green !border-mango-green/30 hover:!bg-mango-light"
              aria-label={txt('shareReport')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
              {txt('shareReport')}
            </a>
          )}

          <p className="text-[10px] text-ink-muted text-center">{txt('poweredBy')}</p>
        </>
      )}
    </div>
  )
}
