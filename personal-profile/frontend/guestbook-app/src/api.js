const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL in environment.");
}

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

export async function getEntries() {
  const response = await fetch(`${API_BASE_URL}/api/entries`);

  if (!response.ok) {
    throw new Error("Failed to fetch entries");
  }

  return response.json();
}

export async function createEntry(data) {
  const response = await fetch(`${API_BASE_URL}/api/entries`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create entry");
  }

  return response.json();
}
