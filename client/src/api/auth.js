import API from "./axios";

// POST /users/signin → body: { email, password }
// response: { success, data: { id, name, email, ... }, token }
export const loginUser = (formData) => API.post("/users/signin", formData);

// POST /users/signup → body: { name, email, password }
// response: { success, data: { id, name, email, ... }, token }
export const signupUser = (formData) => API.post("/users/signup", formData);
