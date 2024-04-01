

const generateRandomDelay = async (min:number, max:number) => {

    min = min * 1000;
    max = max * 1000;

    const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min;

      // Simulate fetching courses with the random delay
    await new Promise(resolve => setTimeout(resolve, randomDelay));
    
}

export default generateRandomDelay;