export default function isValidRatio(input:string) {
    // Attempt to parse the input as a fraction
    const fractionMatch = input?.match(/^(\d+)\/(\d+)$/);
  
    if (fractionMatch) {
      // If the input is in the form of a fraction, convert it to a number
      const numerator = parseInt(fractionMatch[1], 10);
      const denominator = parseInt(fractionMatch[2], 10);
  
      // Check if the fraction is valid and falls within the range [0, 1]
      return (
        Number.isFinite(numerator) &&
        Number.isFinite(denominator) &&
        denominator !== 0 &&
        numerator / denominator >= 0 &&
        numerator / denominator <= 1
      );
    }
  
    // Attempt to convert the input to a number
    const numericValue = Number(input);
  
    // Check if the numeric value is a finite number and falls within the range [0, 1]
    return Number.isFinite(numericValue) && numericValue >= 0 && numericValue <= 1;
  }