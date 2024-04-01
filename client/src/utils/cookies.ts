// Set a cookie with an expiration time (in seconds)
export function setCookie(name:string, value:string, seconds:number) {
    const date = new Date();
    date.setTime(date.getTime() + (seconds * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + value + expires + "; path=/";
}

// Get the value of a cookie
export function getCookie(name:string) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

// Delete a cookie
export function deleteCookie(name:string) {
    setCookie(name, "", -1);
}