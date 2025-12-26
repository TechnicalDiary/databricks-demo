import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/users")
      .then((res) => res ? res.json() : [])
      .then((data) => setUsers(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users from Databricks</h2>
      <ul>
        {users?.map((user, index) => (
          <li key={index}>
            {user[1]} – {user[2]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
