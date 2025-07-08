export function getFormattedDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = String(date.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
}
