const api_url = import.meta.env.VITE_API_URL + "api/";
const server_url = import.meta.env.VITE_API_URL;

const token = localStorage.getItem("auth_token");

export async function fetchPosts(){
    const res = await fetch(api_url + "posts", {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `${token}`
        }
    });

    if (res.status === 401) {
        window.location.href = import.meta.env.BASE_URL + "login";
        return [];
    }

    return res.json().then((data) => {
        return data;
    });
}

export async function fetchFollowedPosts(){
    const res = await fetch(api_url + "posts/followed", {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `${token}`
        }
    });

    if (res.status === 401) {
        window.location.href = import.meta.env.BASE_URL + "login";
        return [];
    }

    return res.json();
}

export async function getUserData(id: number){
    const res = await fetch(api_url + "user/" + id, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `${token}`
        }
    });

    if (res.status === 401) {
        window.location.href = import.meta.env.BASE_URL + "login";
        return {};
    }

    return res.json();
}

export async function getUserProfile(username: string){
    const res = await fetch(api_url + "profile/" + username, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `${token}`
        }
    });

    if (res.status === 401) {
        window.location.href = import.meta.env.BASE_URL + "login";
        return [];
    }

    return res.json();
}

export async function getUserProfilePosts(username: string){
    const res = await fetch(api_url + "profile/" + username + "/posts", {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `${token}`
        }
    });

    if (res.status === 401) {
        window.location.href = import.meta.env.BASE_URL + "login";
        return [];
    }

    return res.json();
}

export async function fetchUsers(){
    const res = await fetch(api_url + "users", {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `${token}`
        }
    });

    if (res.status === 401) {
        window.location.href = import.meta.env.BASE_URL + "login";
        return [];
    }

    return res.json();
}

export async function fetchAdmin(){
    const res = await fetch(api_url + "admin", {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `${token}`
        }
    });

    if (res.status === 401) {
        window.location.href = import.meta.env.BASE_URL + "login";
        return {};
    }

    return res.json();
}    

export { api_url };
export { server_url };