export function sendGetRequest(url: string): Promise<Record<string, unknown>> {
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((json) => json as Record<string, unknown>)
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

export function sendPostRequest(
  url: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => json as Record<string, unknown>)
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

export function sendPutRequest(
  url: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> {
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => json as Record<string, unknown>)
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

export function sendDeleteRequest(url: string): Promise<void> {
  return fetch(url, {
    method: "DELETE",
  })
    .then(() => {
      return;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}
