const BREACH = 'breach';
const BROADCAST = 'broadcast';
const CONSENT = 'consent';
const TICKET = 'ticket';

const values = Object.freeze([
  BREACH,
  BROADCAST,
  CONSENT,
  TICKET,
]);

const NoteTypes = Object.freeze({
  BREACH,
  BROADCAST,
  CONSENT,
  TICKET,
  values,
});

module.exports = NoteTypes;
