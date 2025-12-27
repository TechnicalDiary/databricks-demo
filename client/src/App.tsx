import { useEffect, useState } from 'react'
import './App.css'

interface User {
  id: number;
  name: string;
  email: string;
  // add other fields returned by the API if needed
}

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Remove the localhost URL and use a relative path
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: User[]) => {
        console.log('Users', data);
        setUsers(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users from Databricks</h2>
      <ul>
        {users?.map((user, index) => (
          <li key={index}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
