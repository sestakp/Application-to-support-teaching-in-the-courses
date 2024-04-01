export default function areItemsValid(items: Array<any>, duration: number): boolean {
    const currentTime = Date.now();
    return items.every(item => currentTime - item.timestamp < duration);
}