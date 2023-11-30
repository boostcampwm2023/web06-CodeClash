const WHOLE_AVATAR_COUNT = 21;

export const hashAvatarIdx = (username: string) => {
  return Array.from(username).reduce((acc, cur) => acc + cur.charCodeAt(0), 0) % WHOLE_AVATAR_COUNT;
};
