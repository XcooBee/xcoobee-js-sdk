# XcooBee JavaScript SDK

The XcooBee SDK is a facility to abstract lower level calls and implement
standard behaviors.  The XcooBee team is providing this to improve the speed of
implementation and show the best practices while interacting with XcooBee.

Generally, all communication with XcooBee is encrypted over the wire since none
of the XcooBee systems will accept plain traffic.  All data sent to XcooBee from
you and vice versa is also signed using PGP protocols.  The data packets that
you will receive are signed with your public key and the packages that you send
are signed with your private key.

If you need to generate new PGP keys you can login to your XcooBee account and
go to the settings page to do so.

Some methods require a Consent Campaign setup which you can do in your Consent
Administraion in UI.  You setup such things as endpoints and what data is
collected.  If you have a developer account, a `test` campaign is created
automatically when you signup and no endpoint.  You will need to implement
`getEvents()` to pull events.  You will have no UI access to it.

XcooBee systems operate globally but with regional connections.  The SDK will be
connecting you to your regional endpoint automatically.

There is more detailed and extensive API documentation available on our
[documentation site](https://www.xcoobee.com/docs).

## Install

## Use

# Section 1

## methods

# Section 2

## methods


## Testing

### Integration

Currently, the tests are expecting information from the user with the
`~SDK_Tester` XID.  The user is expected to be in a particular state.  For
instance, the user's inbox should only have one item with very specific values.

This user exists on the system running at https://api.xcoobee.net/.  The
following is the user's API key/secret.  Use this in a `.env.local` file at
`__tests__/integration`.

XCOOBEE__API_KEY=ETrSwpVy1IxDW2Y8fPneN1AtjaBrt9
XCOOBEE__API_SECRET=R2G3l32sp+EetdIcmK4UWgRkiVEvQK
