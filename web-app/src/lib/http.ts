export function sendGetRequest(url: string): Promise<Record<string, unknown>> {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => json as Record<string, unknown>);
}
