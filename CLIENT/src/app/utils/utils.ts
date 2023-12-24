export function formatMoneyVietNam(so: number | bigint) {
    const valueString = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(so);
    return valueString;
  }
  export function  convertStringToNumbers(string: string) {
    let valueNumber = string.replace(/[^\d]/g, '');
    return parseInt(valueNumber);
  }


  
  