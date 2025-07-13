import { getFormattedDate } from "./utils/dateFormatter.js";
import { replaceSwedishLetters } from "./utils/swedishReplacer.js";

(() => {
  async function lookupRoute(flightCode) {
    try {
      const res = await fetch(`https://api.adsbdb.com/v0/callsign/${flightCode}`);
      const json = await res.json();
      const route = json.response?.flightroute;
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

  function setFieldValueProperly(input, value) {
    const prototype = Object.getPrototypeOf(input);
    const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    valueSetter?.call(input, value);

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true })); // triggers validation if any
  }

  async function handleForm() {
    const inputs = [...document.querySelectorAll('input[type="text"], textarea')];
    replaceSwedishLetters(inputs);

    const flightInput = [...inputs].reverse().find(input =>
      /^[A-Z]{1,3}\d{1,5}$/i.test(input.value.trim())
    );

    if (!flightInput) return;

    const flightCode = flightInput.value.trim().toUpperCase();
    const route = await lookupRoute(flightCode);
    if (!route?.origin || !route.destination) {
      console.warn(`Could not find route for "${flightCode}".`);
      return;
    }

    const formattedDate = getFormattedDate();
    const startIndex = inputs.indexOf(flightInput);

    let filled = 0;
    for (let i = startIndex + 1; i < inputs.length && filled < 3; i++) {
      if (!inputs[i].value.trim()) {
        const newValue =
          filled === 0 ? formattedDate
          : filled === 1 ? route.origin
          : route.destination;

        setFieldValueProperly(inputs[i], newValue);
        filled++;
      }
    }
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
