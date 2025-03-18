export async function fetchPosts(){
    const res = await fetch("/src/data/placeholders/posts.json");
    return res.json();
}

export async function fetchUsers(){
    const res = await fetch("/src/data/placeholders/users.json");
    return res.json();
}