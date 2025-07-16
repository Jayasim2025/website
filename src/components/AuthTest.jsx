import { useAuth } from "../contexts/AuthContext";

const AuthTest = () => {
  const { user, loading, isAuthenticated, signOut } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          background: "#f0f0f0",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "12px",
          zIndex: 9999,
        }}
      >
        Auth Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: isAuthenticated ? "#d4edda" : "#f8d7da",
        padding: "10px",
        borderRadius: "5px",
        border: `1px solid ${isAuthenticated ? "#c3e6cb" : "#f5c6cb"}`,
        color: isAuthenticated ? "#155724" : "#721c24",
        fontSize: "12px",
        maxWidth: "250px",
        zIndex: 9999,
      }}
    >
      <div>
        <strong>Auth Status:</strong>{" "}
        {isAuthenticated ? "Authenticated" : "Not Authenticated"}
      </div>
      {user && (
        <div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>ID:</strong> {user.id?.substring(0, 8)}...
          </div>
          <div>
            <strong>Created:</strong>{" "}
            {new Date(user.created_at).toLocaleDateString()}
          </div>
          <button
            onClick={signOut}
            style={{
              marginTop: "5px",
              padding: "2px 8px",
              fontSize: "10px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      )}
      {!user && (
        <div style={{ fontSize: "10px", marginTop: "5px" }}>
          Click "Log In" to test authentication
        </div>
      )}
    </div>
  );
};

export default AuthTest;
