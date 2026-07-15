
export const formatNumber = (value: number | string, locale: string = 'en-US'): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) return '0';
  
    return num.toLocaleString(locale);
  };