import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Dashboard() {
  const { displayName, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <h2>Mentor Dashboard</h2>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main className="dashboard-body">
        <div className="welcome-card">
          <h1>Welcome {displayName || "Soumalya"}</h1>
          <p>You have successfully logged in.</p>
        </div>
      </main>
    </div>
  );
}
