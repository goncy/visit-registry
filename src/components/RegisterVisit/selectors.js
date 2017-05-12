export const getDistance = (userLocation, consortiumLocation) => {
  const OFFSET = 0.017453292519943295
  const DISTANCE = 0.5 -
  Math.cos((consortiumLocation.lat - userLocation.lat) * OFFSET) / 2 +
  Math.cos(userLocation.lat * OFFSET) * Math.cos(consortiumLocation.lat * OFFSET) * (1 - Math.cos((consortiumLocation.lng - userLocation.lng) * OFFSET)) / 2

  return Math.round((12742 * Math.asin(Math.sqrt(DISTANCE))) * 1000)
}
