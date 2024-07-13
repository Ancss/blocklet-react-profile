import { ThemeProvider } from '@did-connect/react';

export default function WrappedApp({ children }: React.PropsWithChildren<{}>) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
