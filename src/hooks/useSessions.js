import { useCallback, useEffect, useState } from "react";
import { clearAll, deleteSession, getSessions, getSession, saveSession } from "../lib/storage";

export const useSessions = () => {
  const [sessions, setSessions] = useState([]);

  const refreshSessions = useCallback(() => {
    setSessions(getSessions());
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const storeSession = (session) => {
    saveSession(session);
    refreshSessions();
  };

  const removeSession = (id) => {
    deleteSession(id);
    refreshSessions();
  };

  const removeAll = () => {
    clearAll();
    setSessions([]);
  };

  return {
    sessions,
    refreshSessions,
    getSession,
    saveSession: storeSession,
    deleteSession: removeSession,
    clearAll: removeAll,
  };
};
