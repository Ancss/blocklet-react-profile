import WalletAuthenticator from '@blocklet/sdk/lib/wallet-authenticator';
import WalletHandler from '@blocklet/sdk/lib/wallet-handler';

const authenticator = new WalletAuthenticator();
export const handlers = new WalletHandler({
  authenticator,
});
export { authenticator };
