const BEE_ICON = 'bee_icon';
const INVITE_LIST = 'invite_list';
const OUTBOX = 'outbox';
const PROFILE_IMAGE = 'profile_image';

const values = Object.freeze([
  BEE_ICON,
  INVITE_LIST,
  OUTBOX,
  PROFILE_IMAGE,
]);

const UploadPolicyIntents = Object.freeze({
  BEE_ICON,
  INVITE_LIST,
  OUTBOX,
  PROFILE_IMAGE,
  values,
});

module.exports = UploadPolicyIntents;
