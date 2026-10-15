export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export function validateSelectedFile(file) {
  if (!file || !["image/png", "image/jpeg"].includes(file.type)) throw new Error("Choose a JPG or PNG image.");
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error("Choose an image no larger than 5 MB.");
}
export function readImage(file, signal) {
  validateSelectedFile(file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const abort = () => reader.abort();
    const cleanup = () => signal?.removeEventListener("abort", abort);
    reader.onload = () => {
      cleanup();
      resolve({
        mimeType: file.type,
        base64: String(reader.result).split(",")[1]
      });
    };
    reader.onerror = () => {
      cleanup();
      reject(new Error("The image could not be read. Please select it again."));
    };
    reader.onabort = () => {
      cleanup();
      reject(new DOMException("Cancelled", "AbortError"));
    };
    if (signal?.aborted) {
      reject(new DOMException("Cancelled", "AbortError"));
      return;
    }
    signal?.addEventListener("abort", abort, {
      once: true
    });
    reader.readAsDataURL(file);
  });
}
export async function documentRequest(path, {
  body,
  method = "GET",
  signal
} = {}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Sign in with your patient account to manage documents.");
  let response;
  try {
    response = await fetch(path, {
      method,
      cache: "no-store",
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      ...(body ? {
        body: JSON.stringify(body)
      } : {})
    });
  } catch (error) {
    if (error.name === "AbortError" || error.name === "TimeoutError") throw error;
    throw new Error("Unable to reach Zoi. Please check your connection and try again.");
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Zoi returned an unexpected response. Please try again.");
  }
  if (!response.ok) throw Object.assign(new Error(response.status === 401 ? "Your session has expired. Please sign in again." : data.message || "This document request could not be completed."), {
    code: data.code,
    status: response.status
  });
  return data;
}
