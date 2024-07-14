/* eslint-disable react/no-unused-prop-types */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

// @ts-ignore
import useConnect from '@arcblock/did-connect/lib/Connect/use-connect';
import { Card, CardContent, Grid, Avatar, Typography, Button, TextField, IconButton, Tooltip, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { createProfile, updateProfile } from '@/libs/api';
import { Profile, ProfileSchemaType } from '@/libs/types';
import { profileSchema } from '@/libs/schema/profile-schema';
import { useDID, useProfile } from '@/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';

type Props = {
  profile: Profile;
  // eslint-disable-next-line react/require-default-props
  onEdit?: () => void;
  // eslint-disable-next-line react/require-default-props
  onCancel?: () => void;
  // eslint-disable-next-line react/require-default-props
  onSubmit?: (data: ProfileSchemaType) => void;
  // eslint-disable-next-line react/require-default-props
  isPending?: boolean;
};

// ProfileInfo component
function NoProfileInfo() {
  const { connectApi, connectHolder } = useConnect();
  const locale = useSelector((state: RootState) => state.i18n.language);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const openConnect = () => {
    console.log('RequestProfileConnect.openConnect', connectApi);
    connectApi.open({
      action: 'request-profile',
      locale,
      async onSuccess({ result }:any) {
        console.log('RequestProfileConnect.onSuccess', result);
        await createProfile({
          did: result.did,
          avatar: result.avatar,
          email: result.email,
          username: result.fullName,
          phone: result.phone,
        });
        console.log('RequestProfileConnect.onSuccess', result.did);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        console.log('RequestProfileConnect.onSuccess', result.did);
        // 更新 URL，添加 did 参数
        navigate(`?did=${result.did}`);
      },
      messages: {
        title: 'Request user profile',
        scan: 'Please provide your name and email to continue',
      },
    });
  };
  return (
    <Grid container spacing={2} className=' min-h-80' alignItems="center">
      <Grid item xs={12} lg={12}>
        <Avatar alt={'user avatar'} className="!w-24 !h-24 mx-auto" />
      </Grid>
      <Grid item xs={12} lg={12}>
        <Button type="button" variant="contained" size="large" onClick={openConnect}
          className=' whitespace-nowrap'
        >
          {t('connectWallet')}
        </Button>
      </Grid>
      {connectHolder}
    </Grid>
  );
}

// ProfileInfo component
function ProfileInfo({ profile }: Props) {
  const { t } = useTranslation();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // 可以在这里添加一个通知来告诉用户复制成功
      enqueueSnackbar('Copied to clipboard', { variant: 'success' });
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };
  return (
    <Grid container spacing={2} className='min-h-80' alignItems="center">
      <Grid item xs={12}>
        <Avatar src={profile.avatar} alt={profile.username} className="!w-24 !h-24 mx-auto" />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h3" className="text-center">
          {profile.username}
        </Typography>
        <Typography variant="body1" className="flex items-center justify-center">
          DID:ABT:{profile.did?.slice(0, 4)}...{profile.did?.slice(30)}
          <Tooltip title={t('copy')}>
            <IconButton onClick={() => copyToClipboard(`DID:ABT:${profile.did}`)}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <Divider></Divider>
        <Typography variant="h5" className="flex items-center !mt-4">
          {t('myProfile')}
        </Typography>
        <Typography variant="h6" className="flex items-center ">
          <EmailIcon className="mr-2" />
          {t('email')}: {profile.email}
        </Typography>
        <Typography variant="h6" className="flex items-center ">
          <PhoneIcon className="mr-2" />
          {t('phone')}: {profile.phone}
        </Typography>
      </Grid>
    </Grid>
  );
}

// ProfileForm component
function ProfileForm({ control }: { control: any }) {
  const { t } = useTranslation();
  return (
    <Grid container spacing={2} className=' min-h-80' alignItems="center">
      <Grid item xs={12} sm={12}>
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => <TextField {...field} label={t('avatarUrl')} fullWidth margin="normal" />}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label={t('username')}
              error={!!error}
              helperText={error?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label={t('email')}
              error={!!error}
              helperText={error?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => <TextField {...field} label={t('phone')} fullWidth margin="normal" />}
        />
      </Grid>
    </Grid>
  );
}

function ProfileDisplay({ profile, onEdit }: Props) {
  return (
    <>
      <ProfileInfo profile={profile} />
      <div className="mt-4 flex justify-end">
        <IconButton onClick={onEdit} color="primary">
          <EditIcon />
        </IconButton>
      </div>
    </>
  );
}

// ProfileEdit component
function ProfileEdit({ profile, onCancel, onSubmit, isPending }: Props) {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<ProfileSchemaType>({
    defaultValues: profile,
    resolver: zodResolver(profileSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit!)}>
      <ProfileForm control={control} />
      <div className="mt-4 flex justify-end">
        <Button type="submit" variant="contained" color="primary" className="mr-2" disabled={isPending}>
          {isPending ? t('saving') : t('save')}
        </Button>
        <Button onClick={onCancel} className='!ml-2' variant="outlined">
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}

// Main ProfileComponent
export default function ProfileComponent() {
  const { did } = useDID()
  const { profile, isLoading, error } = useProfile(did);

  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { enqueueSnackbar } = useSnackbar();

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      setIsEditing(false);
      enqueueSnackbar('Profile updated', { variant: 'success' });
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      enqueueSnackbar('Failed to update profile', { variant: 'error' });
    },
  });

  const handleSubmit = (data: ProfileSchemaType) => {
    mutation.mutate(data);
  };
  if (!did) return <>
    <Card className="mb-4">
      <CardContent>
        <NoProfileInfo /></CardContent>
    </Card>
  </>
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data</div>;

  return (
    <Card className="mb-4">
      <CardContent>
        {isEditing ? (
          <ProfileEdit
            profile={profile}
            onCancel={() => setIsEditing(false)}
            onSubmit={handleSubmit}
            isPending={mutation.isPending}
          />
        ) : (
          <ProfileDisplay profile={profile} onEdit={() => setIsEditing(true)} />
        )}
      </CardContent>
    </Card>
  );
}
