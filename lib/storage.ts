// Helper functions for local storage
export const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromStorage = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const removeFromStorage = (key: string) => {
  localStorage.removeItem(key);
}; 