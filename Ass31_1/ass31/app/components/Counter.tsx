"use client"

import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
  <div className="counter-box">
    <h2>Client Interactivity</h2>

    <p style={{ fontSize: "1.2rem" }}>Count: {count}</p>

    <button onClick={() => setCount(count + 1)}>
      Increase
    </button>

    <button
      onClick={() => setCount(0)}
      style={{ marginLeft: "10px" }}
    >
      Reset
    </button>
  </div>
)

}
