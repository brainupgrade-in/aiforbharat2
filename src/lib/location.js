/**
 * Location service — gets user GPS, reverse geocodes, and generates
 * Google Maps search URLs for nearby ophthalmologists/eye hospitals.
 */

const LOCATION_CACHE_KEY = 'nazar_location'
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

export function getCachedLocation() {
  try {
    const cached = JSON.parse(localStorage.getItem(LOCATION_CACHE_KEY))
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached
    }
  } catch {}
  return null
}

function cacheLocation(loc) {
  try {
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({ ...loc, timestamp: Date.now() }))
  } catch {}
}

/**
 * Get user's current GPS coordinates
 */
export function getGPSPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    )
  })
}

/**
 * Reverse geocode coordinates to get locality name using OpenStreetMap Nominatim (free, no API key)
 */
export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en`,
      { headers: { 'User-Agent': 'NazarAI/1.0' } }
    )
    const data = await res.json()
    const addr = data.address || {}
    return {
      village: addr.village || addr.hamlet || '',
      town: addr.town || addr.city || addr.suburb || '',
      district: addr.county || addr.state_district || '',
      state: addr.state || '',
      pincode: addr.postcode || '',
      display: data.display_name || '',
      short: [addr.village || addr.town || addr.city || addr.suburb, addr.state_district || addr.county, addr.state]
        .filter(Boolean)
        .join(', '),
    }
  } catch {
    return null
  }
}

/**
 * Full location fetch: GPS + reverse geocode, with caching
 */
export async function getUserLocation() {
  const cached = getCachedLocation()
  if (cached) return cached

  const coords = await getGPSPosition()
  const geo = await reverseGeocode(coords.lat, coords.lng)

  const location = {
    lat: coords.lat,
    lng: coords.lng,
    ...geo,
  }
  cacheLocation(location)
  return location
}

/**
 * Google Maps URL to search for nearby eye doctors/hospitals
 */
export function getGoogleMapsSearchURL(lat, lng, query = 'ophthalmologist eye doctor near me') {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${lat},${lng},14z`
}

/**
 * Google Maps URL for directions to a specific place
 */
export function getGoogleMapsDirectionsURL(lat, lng, destQuery) {
  return `https://www.google.com/maps/dir/${lat},${lng}/${encodeURIComponent(destQuery)}`
}

/**
 * Build the share text for a DR screening result. Used by both the Web Share
 * API path (preferred on mobile) and the WhatsApp URL fallback.
 */
function buildShareMessage({ patientId, grade, confidence, lat, lng, locationName }) {
  const locationLink = lat && lng
    ? `\n📍 Location: ${locationName || ''}\nhttps://www.google.com/maps?q=${lat},${lng}`
    : ''
  return `🔬 *Nazar AI — DR Screening Result*

👤 Patient: ${patientId}
🏥 DR Grade: ${grade}
📊 AI Confidence: ${confidence}%
${locationLink}

⚠️ Please consult an ophthalmologist for professional evaluation.

Screened with Nazar AI — https://nazarai.gheware-ai.com`
}

/**
 * Share a DR scan result. Prefers the native Web Share API (most modern mobile
 * browsers — opens the system share sheet with WhatsApp + many other apps).
 * Falls back to api.whatsapp.com (more reliable than wa.me/?text=, which fails
 * silently on some Android browsers when no phone number is supplied).
 */
export async function shareScanResult(opts) {
  const message = buildShareMessage(opts)

  // 1. Web Share API — best UX on mobile, picks up any installed messaging app
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: 'Nazar AI — DR screening result', text: message })
      return { ok: true, via: 'web-share' }
    } catch (err) {
      if (err?.name === 'AbortError') return { ok: false, via: 'web-share', cancelled: true }
      // Fall through to WhatsApp URL fallback on any other error
    }
  }

  // 2. WhatsApp URL fallback — api.whatsapp.com is more reliable than wa.me/
  //    when no recipient phone number is specified.
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
  if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer')
  return { ok: true, via: 'whatsapp-url' }
}

/** @deprecated Kept for backward-compat — use shareScanResult() instead. */
export function getWhatsAppShareURL(opts) {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(buildShareMessage(opts))}`
}

/**
 * Generate tel: link — searches Google Maps for nearest eye doctor and returns
 * a prompt for the user to call from the Maps listing
 */
export function getCallDoctorURL(phone) {
  return `tel:${phone}`
}
