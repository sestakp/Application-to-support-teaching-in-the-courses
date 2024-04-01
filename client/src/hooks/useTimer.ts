import { ref } from 'vue';

export default function useTimer() {
    const elapsedTime = ref(0);
    let timerInterval: number | null = null;

    const formattedTime = (): string => {
        const hours = Math.floor(elapsedTime.value / 3600);
        const minutes = Math.floor((elapsedTime.value % 3600) / 60);
        const seconds = elapsedTime.value % 60;

        return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
    };

    const startTimer = (): void => {
        timerInterval = setInterval(() => {
            elapsedTime.value += 1;
        }, 1000);
    };

    const stopTimer = (): void => {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
    };

    const resetTimer = (): void => {
        elapsedTime.value = 0;
    };

    const padNumber = (number: number): string => {
        return number < 10 ? `0${number}` : number.toString();
    };
    
    /*
    onMounted(() => {
        startTimer();
    });

    onBeforeUnmount(() => {
        stopTimer();
    });
    */
    
    return {
        elapsedTime,
        formattedTime,
        resetTimer,
        startTimer,
        stopTimer,
    };
}
