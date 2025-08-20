export function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

export function getUsersData() {
  return JSON.parse(localStorage.getItem("usersData") || "{}");
}

export function setCurrentUser(username: string) {
  localStorage.setItem("currentUser", username);
}

export function saveUsersData(data) {
  localStorage.setItem("usersData", JSON.stringify(data));
}

export function ensureUserExists(username: string) {
  const users = getUsersData();
  if (!users[username]) {
    users[username] = { likes: [] };
    saveUsersData(users);
  }
}

export function getUserLikes(user: string) {
  const data = getUsersData();
  return data[user]?.likes || [];
}

export function setUserLikes(user: string, likes: number[]) {
  const data = getUsersData();
  if (!data[user]) data[user] = {};
  data[user].likes = likes;
  saveUsersData(data);
}
