export async function doctorRequest(path, options = {}) {
  const token = localStorage.getItem("doctorToken");
  if (!token) throw Object.assign(new Error("Your doctor session has expired. Please sign in again."), {
    status: 401
  });
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Unable to reach Zoi. Check your connection and try again.");
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Zoi returned an unexpected response. Please try again.");
  }
  if (!response.ok) throw Object.assign(new Error(response.status === 401 ? "Your doctor session has expired. Please sign in again." : response.status === 403 ? "This page requires the appropriate doctor account." : data.message || "This request could not be completed. Please try again."), {
    status: response.status
  });
  return data;
}
