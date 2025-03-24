const api_url = "https://animated-journey-6996xj7957973rg74-8080.app.github.dev/api/";

const token = localStorage.getItem("auth_token");

export async function fetchPosts(){    
    const res = await fetch(api_url + "posts", {
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

export async function getUserData(id: number){
    const res = await fetch(api_url + "user/" + id, {
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

export async function fetchUsers(){
    const res = await fetch(api_url + "users", {
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