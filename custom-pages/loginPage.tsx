import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { gql, useMutation } from '@apollo/client';

const SEND_MAGIC_LINK = gql`
  mutation SendMagicLinkWithGoogle($idToken: String!) {
    sendMagicLinkWithGoogle(idToken: $idToken)
  }
`;

const EMAIL_PASSWORD_LOGIN = gql`
  mutation AuthenticateWithPassword($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      __typename
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
          email
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;


export default function LoginPage() {
  const [sendMagicLink] = useMutation(SEND_MAGIC_LINK);
  const [emailPasswordLogin] = useMutation(EMAIL_PASSWORD_LOGIN);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await emailPasswordLogin({ variables: { email, password } });
      if (data.authenticateUserWithPassword.__typename === 'UserAuthenticationWithPasswordSuccess') {
        setMessage('Login successful!');
        // optionally redirect
        window.location.href = '/';
      } else {
        setMessage(data.authenticateUserWithPassword.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Error logging in.');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div style={{ textAlign: 'center', marginTop: 50, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
        <h2>Sign In Components</h2>

        <form onSubmit={handleEmailPasswordLogin} style={{ marginBottom: 20 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
          />
          <button
            type="submit"
            style={{ width: '100%', padding: 10, backgroundColor: '#1D4ED8', color: 'white' }}
          >
            Sign In
          </button>

        </form>

        <h3>or</h3>

        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const idToken = credentialResponse.credential;
              const { data } = await sendMagicLink({ variables: { idToken } });
              if (data.sendMagicLinkWithGoogle) {
                setMessage('Magic link sent! Check your email.');
              } else {
                setMessage('Failed to send magic link.');
              }
            } catch (error) {
              console.error(error);
              setMessage('Error sending magic link.');
            }
          }}
          onError={() => {
            setMessage('Google login failed.');
          }}
        />

        {message && <p style={{ marginTop: 15 }}>{message}</p>}
      </div>
    </GoogleOAuthProvider>
  );
}
