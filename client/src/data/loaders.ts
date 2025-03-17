export async function fetchPosts(){
    const res = await fetch("/src/data/placeholders/posts.json");
    return res.json();
}