export default function Home() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🚀 {appName}</h1>
      <p>Your app is running successfully!</p>
      <p>Environment variable loaded correctly.</p>
    </main>
  );
}
