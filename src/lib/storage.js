const KEY = "lecturedigest_sessions";

export const getSessions = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch (error) {
    return [];
  }
};

export const saveSession = (session) => {
  const all = getSessions();
  const idx = all.findIndex((item) => item.id === session.id);

  if (idx >= 0) {
    all[idx] = session;
  } else {
    all.unshift(session);
  }

  localStorage.setItem(KEY, JSON.stringify(all));
};

export const getSession = (id) =>
  getSessions().find((session) => session.id === id) || null;

export const deleteSession = (id) => {
  const all = getSessions().filter((session) => session.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
};

export const clearAll = () => localStorage.removeItem(KEY);

export const generateId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);
