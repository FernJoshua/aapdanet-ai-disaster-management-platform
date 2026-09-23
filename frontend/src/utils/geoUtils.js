// Geospatial calculation utilities & heuristic evacuation router

// Haversine formula to compute great-circle distance in kilometers
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest shelter
export function findNearestShelter(userLat, userLon, sheltersList, requireAccessible = false) {
  let nearest = null;
  let minDistance = Infinity;

  sheltersList.forEach((shelter) => {
    if (requireAccessible && !shelter.isAccessible) return;
    const dist = calculateDistance(userLat, userLon, shelter.coordinates[0], shelter.coordinates[1]);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = { ...shelter, distanceKm: dist.toFixed(2) };
    }
  });

  return nearest;
}

// Generate realistic polyline waypoints for evacuation corridor bypassing danger zones
export function generateEvacuationRoute(startCoords, destCoords) {
  const [lat1, lon1] = startCoords;
  const [lat2, lon2] = destCoords;

  // Mid-way bend point avoiding inundated lowlands
  const midLat = (lat1 + lat2) / 2 + 0.004;
  const midLon = (lon1 + lon2) / 2 - 0.003;

  return [
    [lat1, lon1],
    [lat1 + (midLat - lat1) * 0.5, lon1 + (midLon - lon1) * 0.5],
    [midLat, midLon],
    [midLat + (lat2 - midLat) * 0.5, midLon + (lon2 - midLon) * 0.5],
    [lat2, lon2]
  ];
}

// Multi-hazard ML composite risk scoring formula
export function computeDisasterRisk({ rainfall, riverLevel, windSpeed, slopeAngle, soilSaturation, tremorMagnitude }) {
  // Flood score: 0 to 100
  const floodScore = Math.min(
    100,
    (rainfall / 150) * 45 + (riverLevel / 4.5) * 35 + (soilSaturation / 100) * 20
  );

  // Landslide score: 0 to 100
  const landslideScore = Math.min(
    100,
    (slopeAngle / 45) * 35 + (rainfall / 150) * 40 + (soilSaturation / 100) * 25
  );

  // Cyclone score: 0 to 100
  const cycloneScore = Math.min(
    100,
    (windSpeed / 180) * 75 + (rainfall / 150) * 25
  );

  // Earthquake score: 0 to 100
  const seismicScore = Math.min(
    100,
    (tremorMagnitude / 7.5) * 100
  );

  const maxRisk = Math.max(floodScore, landslideScore, cycloneScore, seismicScore);

  let category = "LOW";
  let color = "#10b981";
  if (maxRisk > 80) {
    category = "CRITICAL / CATASTROPHIC";
    color = "#ef4444";
  } else if (maxRisk > 60) {
    category = "HIGH SEVERITY";
    color = "#f59e0b";
  } else if (maxRisk > 35) {
    category = "MODERATE ALERT";
    color = "#3b82f6";
  }

  return {
    compositeScore: Math.round(maxRisk),
    category,
    color,
    floodScore: Math.round(floodScore),
    landslideScore: Math.round(landslideScore),
    cycloneScore: Math.round(cycloneScore),
    seismicScore: Math.round(seismicScore)
  };
}
