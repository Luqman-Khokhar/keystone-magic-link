import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MagicLogin() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const token = router.query.token;
      if (!token) return;

      console.log("Token found:", token);

      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation MagicLogin($token: String!) {
              magicLogin(token: $token)
            }
          `,
          variables: { token },
        }),
        credentials: 'include',
      });

      const data = await res.json();
      console.log('Magic login response:', data);

      if (data.data?.magicLogin) {
        router.replace('/');
      } else {
        router.replace('/');
      }
    };

    run();
  }, [router]);

  return <p>Logging you in with magic link...</p>;
}
