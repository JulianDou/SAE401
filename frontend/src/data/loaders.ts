export async function fetchPosts(){
    const res = await fetch("http://localhost:8080/api/posts");
    return res.json();
}

export async function fetchUsers(){
    const res = await fetch("/src/data/placeholders/users.json");
    return res.json();
}