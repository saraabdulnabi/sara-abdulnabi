export async function getPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "no-store"
  })

  if (!res.ok) {
    throw new Error("Failed to fetch posts")
  }

  return res.json()
}
