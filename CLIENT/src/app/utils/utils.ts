export function formatMoneyVietNam(so: number | bigint) {
  const valueString = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(so);
  return valueString;
}
export function convertStringToNumbers(string: string) {
  let valueNumber = string.replace(/[^\d]/g, '');
  return parseInt(valueNumber);
}

export function formatDate(isoString: string): string {
  const dateObject = new Date(isoString);
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

