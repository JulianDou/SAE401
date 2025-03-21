const api_url = "https://animated-journey-6996xj7957973rg74-8080.app.github.dev/api/";

export async function fetchPosts(){
    const res = await fetch(api_url + "posts");

    if (res.status === 401) {
        window.location.href = "/login";
        return [];
    }

    return res.json().then((data) => {
        return data.posts;
    });
}

export async function fetchUsers(){
    const res = await fetch("/src/data/placeholders/users.json");
    return res.json();
}

export { api_url };