export function getDevSession() {
  if (process.env.NODE_ENV !== 'development') return null;

  return {
    user: {
      id: 'dev-user',
      name: 'Dev User',
      email: 'dev@test.com',
    },
  };
}