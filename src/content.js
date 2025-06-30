import { replaceSwedishLetters } from "./utils/swedishReplacer.js";

(() => {
  async function lookupRoute(flightCode) {
    try {
      const res = await fetch(`https://api.adsbdb.com/v0/callsign/${flightCode}`);
      const json = await res.json();
      const route = json.response?.flightroute;
      console.log(res)
      if (!route) return null;
      return {
        origin: route.origin?.iata_code,
        destination: route.destination?.iata_code,
      };
    } catch (err) {
      console.error("Route fetch failed:", err);
      return null;
    }
  }

  async function handleForm() {
    const inputs = [...document.querySelectorAll('input[type="text"], textarea')];
    const date = new Date();
    const formattedDate =
      String(date.getDate()).padStart(2, '0') +
      date.toLocaleString('en-GB', { month: 'short' }) +
      String(date.getFullYear()).slice(-2);

    // Updated regex: 1–3 letters + 1–5 digits
    const flightInput = [...inputs].reverse().find(input =>
      /^[A-Z]{1,3}\d{1,5}$/i.test(input.value.trim())
    );

    if (!flightInput) return;

    const flightCode = flightInput.value.trim().toUpperCase();
    const route = await lookupRoute(flightCode);
    if (!route?.origin || !route.destination) {
      alert(`Could not find route for "${flightCode}".`);
      return;
    }

    let filled = 0;
    const startIndex = inputs.indexOf(flightInput);
    for (let i = startIndex + 1; i < inputs.length && filled < 3; i++) {
      if (!inputs[i].value.trim()) {
        inputs[i].value = filled === 0
          ? formattedDate
          : filled === 1
          ? route.origin
          : route.destination;
        filled++;
      }
    }

    console.log(replaceSwedishLetters("Örebro, Älmhult, Åre"));
    // Normalize Swedish letters
    inputs.forEach(input => {
      input.value = replaceSwedishLetters(input.value)
    });
  }

  handleForm();

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key.toLowerCase() === 'm') {
      e.preventDefault();
      e.stopPropagation();
      handleForm();
    }
  });
})();
