import { useState } from "react";
import api from "../api/axios";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const checkHealth = async () => {
    try {
      setLoading(true);

      const res = await api.get("/health");

      setResult(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      console.error(err);
      setResult("Error calling health endpoint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={checkHealth} disabled={loading}>
        {loading ? "Checking..." : "Check API Health"}
      </button>

      {result && (
        <pre style={{ marginTop: "1rem" }}>
          {result}
        </pre>
      )}
    </div>
  );
};

export default Dashboard;