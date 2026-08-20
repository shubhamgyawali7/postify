export const HOME_ROUTE = "/";
export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/register";
export const POST_CREATE_ROUTE = "/posts/create";
export const POST_DETAILS_ROUTE = "/posts/:id";
export const POST_EDIT_ROUTE = "/posts/:id/edit";
export const ADMIN_ROUTE = "/admin";

export const postDetailsPath = (id) => `/posts/${id}`;
export const postEditPath = (id) => `/posts/${id}/edit`;
