export async function fetchFlightInfo(flightCode, fromDate, toDate) {
  const url = `https://aerodatabox.p.rapidapi.com/flights/number/${flightCode}/${fromDate}/${toDate}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'your-key-here',
      'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
    }
  });
  const data = await response.json();
  return data[0] || data[1] || data[2] || null;
}
