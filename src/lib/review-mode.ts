const TRUTHY_VALUES = new Set(["1", "true", "yes", "on"]);

function isTruthy(value: string | undefined) {
  return value ? TRUTHY_VALUES.has(value.toLowerCase()) : false;
}

export function isReviewOpenAccessEnabled() {
  return isTruthy(process.env.REVIEW_OPEN_ACCESS);
}

export function getReviewCredentials() {
  if (!isReviewOpenAccessEnabled()) {
    return null;
  }

  const email = process.env.REVIEW_USER_EMAIL;
  const password = process.env.REVIEW_USER_PASSWORD;

  if (!email || !password) {
    return null;
  }

  return { email, password };
}
