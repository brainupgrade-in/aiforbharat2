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
 * Generate WhatsApp share message with scan result and location
 */
export function getWhatsAppShareURL({ patientId, grade, confidence, lat, lng, locationName }) {
  const locationLink = lat && lng
    ? `\n📍 Location: ${locationName || ''}\nhttps://www.google.com/maps?q=${lat},${lng}`
    : ''
  const message = `🔬 *Nazar AI — DR Screening Result*

👤 Patient: ${patientId}
🏥 DR Grade: ${grade}
📊 AI Confidence: ${confidence}%
${locationLink}

⚠️ Please consult an ophthalmologist for professional evaluation.

Screened with Nazar AI — https://nazarai.gheware-ai.com`

  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

/**
 * Generate tel: link — searches Google Maps for nearest eye doctor and returns
 * a prompt for the user to call from the Maps listing
 */
export function getCallDoctorURL(phone) {
  return `tel:${phone}`
}
