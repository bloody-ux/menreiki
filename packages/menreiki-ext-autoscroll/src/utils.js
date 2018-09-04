export function setSession(key, value) {
  try {
    // 可能出现空间满了，或者被禁的情况
    window.sessionStorage[key] = JSON.stringify(value);
  } catch {
    // nothing
  }
}

export function getSession(key) {
  try {
    // 可能出现空间满了，或者被禁的情况
    const value = window.sessionStorage[key];
    if (typeof value === 'undefined') return value;

    return JSON.parse(value);
  } catch {
    return undefined;
  }
}
