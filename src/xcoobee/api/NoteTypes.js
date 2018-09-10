export const BREACH = 'breach';
export const BROADCAST = 'broadcast';
export const CONSENT = 'consent';
export const TICKET = 'ticket';

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

export default NoteTypes;
