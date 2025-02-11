/**
 * Returns the same given string with every word's 1st letter
 * changed into the uppercase version of it,
 * and the remaining letters in its lowercase version.
 *
 * @param {string} string - A string to capitalize
 * @returns {string}
 */
export function capitalize(string) {
  if (typeof string !== 'string') {
    throw TypeError(`Expect a string but given: ${string}`);
  } else if (string === '') return string;

  const capWord = (w) => w[0].toUpperCase() + w.slice(1).toLowerCase();

  const words = string.split(' ');
  const capitalizedWords = words.map((w) => capWord(w));
  const capitalizedString = capitalizedWords.join(' ');

  return capitalizedString;
}

export default capitalize;
