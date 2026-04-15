export function getDevSession() {
  if (process.env.NODE_ENV !== 'development') return null;

  return {
    user: {
      id: 'dev-user',
      name: 'Dev User',
      email: 'dev@test.com',
      image: 'https://www.pngall.com/wp-content/uploads/14/Y2k-Star-PNG-Picture.png',
    },
  };
}