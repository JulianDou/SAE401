const api_url = "https://animated-journey-6996xj7957973rg74-8080.app.github.dev/api/";
const server_url = "https://animated-journey-6996xj7957973rg74-8080.app.github.dev/";

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
        window.location.href = "/login";
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
        window.location.href = "/login";
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
        window.location.href = "/login";
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
        window.location.href = "/login";
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
        window.location.href = "/login";
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
        window.location.href = "/login";
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
        window.location.href = "/login";
        return {};
    }

    return res.json();
}    

export { api_url };
export { server_url };