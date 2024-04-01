export default function isNewerThan(timestamp: number, duration: number): boolean {
    const currentTime = Date.now();
    return currentTime - timestamp < duration;
}