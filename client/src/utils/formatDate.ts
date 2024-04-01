export default function formatDate(date: Date | string):string {
    let parsedDate: Date;
    if (typeof date === 'string') {
      parsedDate = new Date(date);
    } else {
        parsedDate = date;
    }

    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date');
  }

    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
  
    return `${day}.${month}.${year}`;
  }
  