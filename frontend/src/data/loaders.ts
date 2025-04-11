const api_url = import.meta.env.VITE_API_URL + "api/";

const token = localStorage.getItem("auth_token");

export async function fetchPosts(){    
    const res = await fetch(api_url + "posts", {
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

export async function getUserData(id: number){
    const res = await fetch(api_url + "user/" + id, {
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

export async function fetchUsers(){
    const res = await fetch(api_url + "users", {
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