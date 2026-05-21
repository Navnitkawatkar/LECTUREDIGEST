import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Session from "./pages/Session";
import { useSessions } from "./hooks/useSessions";

export default function App() {
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const sessionsHook = useSessions();

  return (
    <div className="app-shell">
      <Routes>
        <Route
          path="/"
          element={
            <Home
              sessionsHook={sessionsHook}
              currentSessionId={currentSessionId}
              setCurrentSessionId={setCurrentSessionId}
            />
          }
        />
        <Route path="/session/:id" element={<Session sessionsHook={sessionsHook} />} />
      </Routes>
    </div>
  );
}
