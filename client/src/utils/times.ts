
export function addTimes(time1:string, time2:string) {
    // Parse times
    const parsedTime1 = parseTime(time1);
    const parsedTime2 = parseTime(time2);

    // Convert times to seconds
    const totalSeconds = parsedTime1.totalSeconds + parsedTime2.totalSeconds;
    
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
  
    // Format the result
    const result = formatTime(hours, minutes, seconds);
  
    return result;
  }

  export function getTimesRatio(time1: string, time2: string) {
    // Parse times
    const parsedTime1 = parseTime(time1);
    const parsedTime2 = parseTime(time2);

    // Calculate ratio of total seconds
    const ratio = parsedTime1.totalSeconds / parsedTime2.totalSeconds;

    // Format the result
    const formattedRatio = formatRatio(ratio);

    return formattedRatio;
}

  function formatRatio(ratio: number) {
      return ratio; // Adjust the number of decimal places as needed
  }
  
  function parseTime(time:string) {
    const [hours, minutes, seconds] = time.split(":").map(Number);
  
    //logger.debug("parse time: ", hours, minutes, seconds)
    // Convert hours and minutes to seconds
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
    return {
      hours,
      minutes,
      seconds,
      totalSeconds,
    };
  }
  
  function formatTime(hours:number, minutes:number, seconds:number) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  
  function pad(num:number) {
    return num.toString().padStart(2, "0");
  }

  /*
  // Example usage
  const time1 = "10:30:45";
  const time2 = "5:15:20";
  
  const result = sumTimes(time1, time2);
  logger.debug(result); // Output: "15:46:05"
  */
  