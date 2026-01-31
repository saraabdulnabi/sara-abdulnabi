import { getPosts } from "./services/api"
import Counter from "./components/Counter"

type Post = {
  id: number
  title: string
  body: string
}

export default async function Home() {
  const posts: Post[] = await getPosts()

  return (
    <main style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Homework Project</h1>

      <h2>Server Fetched Posts</h2>

      {posts.slice(0, 5).map((post) => (
  <div key={post.id} className="post-card">
    <h3>{post.title}</h3>
    <p>{post.body}</p>
  </div>
))}


      <Counter />
    </main>
  )
}
