const BREACH = 'breach';
const BROADCAST = 'broadcast';
const CONSENT = 'consent';
const TICKET = 'ticket';
const DATA_REQUEST = 'data_request';
const COMPLAINT = 'complaint';

const values = Object.freeze([
  BREACH,
  BROADCAST,
  CONSENT,
  TICKET,
  DATA_REQUEST,
  COMPLAINT,
]);

const NoteTypes = Object.freeze({
  BREACH,
  BROADCAST,
  CONSENT,
  TICKET,
  DATA_REQUEST,
  COMPLAINT,
  values,
});

module.exports = NoteTypes;
