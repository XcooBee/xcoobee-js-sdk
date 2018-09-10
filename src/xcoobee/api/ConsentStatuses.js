export const ACTIVE = 'active';
export const CANCELED = 'canceled';
export const EXPIRED = 'expired';
export const PENDING = 'pending';
export const OFFER = 'offer';
export const REJECTED = 'rejected';
export const UPDATING = 'updating';

const values = Object.freeze([
  ACTIVE,
  CANCELED,
  EXPIRED,
  PENDING,
  OFFER,
  REJECTED,
  UPDATING,
]);

const ConsentStatuses = Object.freeze({
  ACTIVE,
  CANCELED,
  EXPIRED,
  PENDING,
  OFFER,
  REJECTED,
  UPDATING,
  values,
});

export default ConsentStatuses;
