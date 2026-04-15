// Google Places API wrapper — finds REAL Greek businesses by category + location.
// Falls back gracefully if no API key is configured.

const fetch = require('node-fetch');

const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Map BrandGuard sector keywords to Google Places "type" or text query
const SECTOR_TO_QUERY = {
  'εστιατόριο/καφέ': 'restaurant cafe',
  'λιανικό': 'shop retail',
  'logistics': 'logistics freight',
  'ομορφιά': 'beauty salon hair',
  'τρόφιμα': 'food production bakery',
  'άλλο': 'small business',
};

/**
 * Search Google Places Text Search for businesses matching sector + city in Greece.
 * Returns up to `max` results with name, website, formatted_phone_number, formatted_address.
 * If no API key, returns { ok: false, reason: 'no_api_key' }.
 */
async function searchPlaces(sector, city, max = 20) {
  if (!PLACES_KEY) {
    return { ok: false, reason: 'no_api_key', places: [] };
  }

  const query = `${SECTOR_TO_QUERY[sector] || sector} in ${city}, Greece`;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&region=gr&language=el&key=${PLACES_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data.status, data.error_message);
      return { ok: false, reason: data.status, places: [] };
    }

    // For each result, fetch details to get website & phone
    const results = [];
    const candidates = (data.results || []).slice(0, max);

    for (const p of candidates) {
      try {
        const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${p.place_id}&fields=name,website,formatted_phone_number,formatted_address,url&key=${PLACES_KEY}`;
        const dRes = await fetch(detailUrl);
        const dData = await dRes.json();
        const d = dData.result || {};
        results.push({
          business_name: d.name || p.name,
          website: d.website || null,
          phone: d.formatted_phone_number || null,
          address: d.formatted_address || p.formatted_address || null,
          google_maps_url: d.url || null,
          place_id: p.place_id,
        });
      } catch (err) {
        console.error('Place detail error:', err.message);
      }
    }

    return { ok: true, places: results };
  } catch (err) {
    console.error('Places search failed:', err.message);
    return { ok: false, reason: 'fetch_failed', places: [] };
  }
}

module.exports = { searchPlaces };
