/* eslint-disable object-curly-newline */
import { useContext } from 'react';
  // @ts-ignore
import { createAuthServiceSessionContext } from '@arcblock/did-connect/lib/Session';

const { SessionProvider, SessionContext, SessionConsumer, withSession } = createAuthServiceSessionContext();

function useSessionContext() {
  const info = useContext(SessionContext);
  return info;
}

export { SessionProvider, SessionContext, SessionConsumer, useSessionContext, withSession };
