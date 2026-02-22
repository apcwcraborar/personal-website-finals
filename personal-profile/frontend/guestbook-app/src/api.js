const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL in environment.");
}

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid login");
  }

  return response.json();
}

export async function getEntries(token) {
  const response = await fetch(`${API_BASE_URL}/api/entries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch entries");
  }

  return response.json();
}

export async function createEntry(token, data) {
  const response = await fetch(`${API_BASE_URL}/api/entries`, {
    method: "POST",
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create entry");
  }

  return response.json();
}

export async function updateEntry(token, id, data) {
  const response = await fetch(`${API_BASE_URL}/api/entries/${id}`, {
    method: "PUT",
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update entry");
  }

  return response.json();
}

export async function deleteEntry(token, id) {
  const response = await fetch(`${API_BASE_URL}/api/entries/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete entry");
  }

  return response.json();
}
