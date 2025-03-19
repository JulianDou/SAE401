export async function fetchPosts(){
    const res = await fetch("https://animated-journey-6996xj7957973rg74-8080.app.github.dev/api/posts");
    return res.json().then((data) => {
        return data.posts;
    });
}

export async function fetchUsers(){
    const res = await fetch("/src/data/placeholders/users.json");
    return res.json();
}