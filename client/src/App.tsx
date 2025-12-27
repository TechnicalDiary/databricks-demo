import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Remove the localhost URL and use a relative path
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users from Databricks</h2>
      <ul>
        {users?.map((user, index) => (
          <li key={index}>
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
