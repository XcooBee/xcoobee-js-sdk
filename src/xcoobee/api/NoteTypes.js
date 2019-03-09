const BREACH = 'breach';
const BROADCAST = 'broadcast';
const COMPLAINT = 'complaint';
const CONSENT = 'consent';
const DATA_REQUEST = 'data_request';
const TICKET = 'ticket';

const values = Object.freeze([
  BREACH,
  BROADCAST,
  COMPLAINT,
  CONSENT,
  DATA_REQUEST,
  TICKET,
]);

const NoteTypes = Object.freeze({
  BREACH,
  BROADCAST,
  COMPLAINT,
  CONSENT,
  DATA_REQUEST,
  TICKET,
  values,
});

module.exports = NoteTypes;
