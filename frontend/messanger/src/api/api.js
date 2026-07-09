const API = import.meta.env.VITE_API_URL;

export async function loginUser(username, password) {
    const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    return await res.json();
}

export async function registerUser(username, password) {
    const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    return await res.json();
}

export async function webPushRegister(subscription){
    const res = await fetch(`${API}/api/push/subscribe`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(subscription)
    });
}