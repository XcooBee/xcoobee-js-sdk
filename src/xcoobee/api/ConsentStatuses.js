const ACTIVE = 'active';
const CANCELED = 'canceled';
const EXPIRED = 'expired';
const PENDING = 'pending';
const OFFER = 'offer';
const REJECTED = 'rejected';
const UPDATING = 'updating';

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

module.exports = ConsentStatuses;
