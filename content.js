async function handleForm() {
  const inputs = [...document.querySelectorAll('input[type="text"], textarea')];

  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = String(date.getFullYear()).slice(-2);
  const formattedDate = `${day}${month}${year}`;

  // Find the LAST flight number from bottom-up
  const flightInput = [...inputs].reverse().find(input => /^[A-Z]{1,2}\d+$/i.test(input.value.trim()));
  if (flightInput) {
    const flightCode = flightInput.value.trim().toUpperCase();
    const fromDate = new Date(date);
    fromDate.setDate(fromDate.getDate() - 2);
    const toDate = new Date(date);
    toDate.setDate(toDate.getDate() + 2);

    const url = `https://aerodatabox.p.rapidapi.com/flights/number/${flightCode}/${fromDate.toISOString().slice(0, 10)}/${toDate.toISOString().slice(0, 10)}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '8783071712mshde77f5633c0fd4dp145a69jsn1e26a491e138',
          'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
        }
      });

      const data = await response.json();
      console.log(data)
      const flight = data[0] || data[1] || data[2];
      if (!flight) {
        alert("Flight not found.");
        return;
      }

      const origin = flight.departure.airport.iata;
      const destination = flight.arrival.airport.iata;

      //  Fill the next 3 empty fields AFTER the flight input
      let filled = 0;
      const startIndex = inputs.indexOf(flightInput);
      for (let i = startIndex + 1; i < inputs.length && filled < 3; i++) {
        if (!inputs[i].value.trim()) {
          if (filled === 0) inputs[i].value = formattedDate;
          else if (filled === 1) inputs[i].value = origin;
          else if (filled === 2) inputs[i].value = destination;
          filled++;
        }
      }

    } catch (error) {
      console.error("API error:", error);
      alert("Could not fetch flight data.");
    }
  }

  // Always replace Swedish letters
  inputs.forEach(input => {
    input.value = input.value
      .replace(/ö/g, 'oe')
      .replace(/Ö/g, 'Oe')
      .replace(/ä/g, 'ae')
      .replace(/Ä/g, 'Ae')
      .replace(/å/g, 'aa')
      .replace(/Å/g, 'Aa');
  });
}

// Initial run
handleForm();

// Ctrl + M to rerun
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'm') {
    e.preventDefault();
    handleForm();
  }
});
