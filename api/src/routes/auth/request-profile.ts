import omit from 'lodash/omit';
// import logger from '../../libs/logger';

const action = 'request-profile';
module.exports = {
  action,
  claims: {
    profile: () => ({
      description: 'Please provide your full profile',
      fields: ['fullName', 'email', 'phone', 'signature', 'avatar', 'birthday'],
    }),
  },

  onAuth: ({ userDid, userPk, claims, updateSession }: any) => {
    const claim = claims.find((x: any) => x.type === 'profile');
    // logger.log(`${action}.onAuth`, { userDid, userPk, claim });
    updateSession({
      result: {
        ...omit(claim, ['type', 'signature']),
        did: userDid,
        pk: userPk,
      },
    });
  },
};