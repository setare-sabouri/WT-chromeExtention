export function replaceSwedishLetters(inputs) {
  inputs.forEach(input => {
    input.value = input.value
      .replace(/ö/g, 'oe').replace(/Ö/g, 'Oe')
      .replace(/ä/g, 'ae').replace(/Ä/g, 'Ae')
      .replace(/å/g, 'aa').replace(/Å/g, 'Aa');

  });
  return
}

