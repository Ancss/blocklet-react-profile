import { Router } from "express";

/* eslint-disable global-require */
const { handlers } = require('../../libs/auth');

export default {
  init(app: Router) {
    handlers.attach({ app, ...require('./request-profile') });
    // handlers.attach({ app, ...require('./request-text-signature') });
    // handlers.attach({ app, ...require('./request-digest-signature') });
    // handlers.attach({ app, ...require('./request-transaction-signature') });
    // handlers.attach({ app, ...require('./request-payment') });
    // handlers.attach({ app, ...require('./request-nft') });
    // handlers.attach({ app, ...require('./multiple-claims') });
    // handlers.attach({ app, ...require('./multiple-steps') });
  },
};
