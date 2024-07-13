import { useState } from 'react';

// @ts-ignore
import useConnect from '@arcblock/did-connect/lib/Connect/use-connect';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ProfileSchemaType } from '@/libs/types';
import { useTranslation } from 'react-i18next';

function RequestProfileConnect() {
  const { connectApi, connectHolder } = useConnect();
  const [connectedUser, setConnectedUser] = useState<ProfileSchemaType | null>(null);
  const locale = useSelector((state: RootState) => state.i18n.language);
  const openConnect = () => {
    connectApi.open({
      action: 'request-profile',
      locale,
      onSuccess({ result }: { result: ProfileSchemaType }) {
        console.log('RequestProfileConnect.onSuccess', result);
        setConnectedUser(result);
      },
      messages: {
        title: 'Request user profile',
        scan: 'Please provide your name and email to continue',
      },
    });
  };
  const { t } = useTranslation()
  return (
    <header className="app-header">
      {!connectedUser && (
        <Button type="button" variant="contained" size="large" onClick={openConnect}>
          {t('connectWallet')}
        </Button>
      )}
      {/* {connectedUser && (
        <div style={{ textAlign: 'left' }}>
          Connected: <pre>{JSON.stringify(connectedUser, null, 2)}</pre>
          <button type="button" onClick={openConnect}>
            Switch User
          </button>
        </div>
      )}*/}
      {connectHolder}
    </header>
  );
}

export default RequestProfileConnect;
