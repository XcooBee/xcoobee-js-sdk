jest.mock('../../../../../src/xcoobee/api/BeesApi');
jest.mock('../../../../../src/xcoobee/api/DirectiveApi');
jest.mock('../../../../../src/xcoobee/sdk/FileUtils');

const BeesApi = require('../../../../../src/xcoobee/api/BeesApi');
const DirectiveApi = require('../../../../../src/xcoobee/api/DirectiveApi');
const FileUtils = require('../../../../../src/xcoobee/sdk/FileUtils');
const PagingResponse = require('../../../../../src/xcoobee/sdk/PagingResponse');
const ErrorResponse = require('../../../../../src/xcoobee/sdk/ErrorResponse');

const Bees = require('../../../../../src/xcoobee/sdk/Bees');

describe('Bees', () => {

  describe('listBees', () => {

    it('should throw an error if config not initialized', () => {
      const bees = new Bees();

      return bees.listBees()
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toBe('Illegal State: Default config has not been set yet.');
        });
    });

    it('should return response with bees inside', () => {
      BeesApi.bees.mockReturnValue(Promise.resolve({ data: [{ name: 'bee1' }, { name: 'bee2' }], page_info: {} }));

      const bees = new Bees({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' });

      return bees.listBees('bee')
        .then((res) => {
          expect(BeesApi.bees).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'bee', null, undefined);

          expect(res).toBeInstanceOf(PagingResponse);
          expect(res.code).toBe(200);
          expect(res.result.data.length).toBe(2);
          expect(res.result.data[0].name).toBe('bee1');
          expect(res.result.data[1].name).toBe('bee2');
          expect(res.hasNextPage()).toBeFalsy();
        });
    });

  });

  describe('takeOff', () => {

    it('should throw an error if config not initialized', () => {
      const bees = new Bees();

      return bees.takeOff()
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toBe('Illegal State: Default config has not been set yet.');
        });
    });

    it('should return ErrorResponse', () => {
      DirectiveApi.addDirective.mockReturnValue(Promise.reject({ message: 'error' }));

      const bees = new Bees({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' });

      const processBees = {};
      const options = {
        process: {},
        destinations: [],
      };
      const subscriptions = {};

      return bees.takeOff(processBees, options, subscriptions)
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('error');
        });
    });

    it('should call api helper with bee and email destination', () => {
      DirectiveApi.addDirective.mockReturnValue(Promise.resolve('refId'));

      const bees = new Bees({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' });

      const processBees = { simple_bee: { param: 'value' } };
      const options = {
        process: {
          fileNames: ['image.png'],
          destinations: ['test@xcoobee.com'],
        },
      };
      const subscriptions = {};

      return bees.takeOff(processBees, options, subscriptions)
        .then((res) => {
          expect(res.result.ref_id).toBe('refId');

          expect(BeesApi.bees).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'bee', null, undefined);
          expect(DirectiveApi.addDirective).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', {
            filenames: ['image.png'],
            user_reference: null,
            destinations: [{ email: 'test@xcoobee.com' }],
            subscriptions: {},
            bees: [{ bee_name: 'simple_bee', params: '{"param":"value"}' }],
          });
        });
    });

    it('should call api helper with bee, xcoobee destination and subscriptions', () => {
      DirectiveApi.addDirective.mockReturnValue(Promise.resolve('refId'));

      const bees = new Bees({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' });

      const processBees = { simple_bee: { param: 'value' } };
      const options = {
        process: {
          fileNames: ['image.png'],
          destinations: ['~testUser'],
        },
      };
      const subscriptions = {};

      return bees.takeOff(processBees, options, subscriptions)
        .then((res) => {
          expect(res.result.ref_id).toBe('refId');

          expect(BeesApi.bees).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'bee', null, undefined);
          expect(DirectiveApi.addDirective).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', {
            filenames: ['image.png'],
            user_reference: null,
            destinations: [{ xcoobee_id: '~testUser' }],
            subscriptions: {},
            bees: [{ bee_name: 'simple_bee', params: '{"param":"value"}' }],
          });
        });
    });

    it('should call api helper with destination and filter transfer bee', () => {
      DirectiveApi.addDirective.mockReturnValue(Promise.resolve('refId'));

      const bees = new Bees({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' });

      const processBees = { transfer: {} };
      const options = {
        process: {
          fileNames: ['image.png'],
          destinations: ['~testUser'],
        },
      };
      const subscriptions = {};

      return bees.takeOff(processBees, options, subscriptions)
        .then((res) => {
          expect(res.result.ref_id).toBe('refId');

          expect(BeesApi.bees).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'bee', null, undefined);
          expect(DirectiveApi.addDirective).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', {
            filenames: ['image.png'],
            user_reference: null,
            destinations: [{ xcoobee_id: '~testUser' }],
            subscriptions: {},
            bees: [],
          });
        });
    });

    it('should call api helper with subscriptions', () => {
      DirectiveApi.addDirective.mockReturnValue(Promise.resolve('refId'));

      const bees = new Bees({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' });

      const processBees = { simple_bee: {} };
      const options = {
        process: {
          fileNames: ['image.png'],
          destinations: ['~testUser'],
        },
      };
      const subscriptions = {
        target: 'https://xcoobee.infinue.com/xbee/webhook.php',
        events: ['error', 'success', 'deliver', 'present', 'download'],
        signed: true,
      };

      return bees.takeOff(processBees, options, subscriptions)
        .then((res) => {
          expect(res.result.ref_id).toBe('refId');

          expect(BeesApi.bees).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'bee', null, undefined);
          expect(DirectiveApi.addDirective).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', {
            filenames: ['image.png'],
            user_reference: null,
            destinations: [{ xcoobee_id: '~testUser' }],
            subscriptions: {
              target: 'https://xcoobee.infinue.com/xbee/webhook.php',
              events: ['error', 'success', 'deliver', 'present', 'download'],
              signed: true,
            },
            bees: [{ bee_name: 'simple_bee', params: '{}' }],
          });
        });
    });

    it('should transform custom properties', () => {
      DirectiveApi.addDirective.mockReturnValue(Promise.resolve('refId'));

      const bees = new Bees({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' });

      const processBees = { simple_bee: { param: 'value' } };
      const options = {
        custom: {
          test: 'hello world',
          anotherProperty: 'test 123',
        },
        process: {
          fileNames: ['image.png'],
          destinations: ['~testUser'],
        },
      };
      const subscriptions = {};

      return bees.takeOff(processBees, options, subscriptions)
        .then((res) => {
          expect(res.result.ref_id).toBe('refId');

          expect(BeesApi.bees).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'bee', null, undefined);
          expect(DirectiveApi.addDirective).toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', {
            filenames: ['image.png'],
            user_reference: null,
            destinations: [{ xcoobee_id: '~testUser' }],
            subscriptions: {},
            custom: [{ name: 'test', value: 'hello world' }, { name: 'anotherProperty', value: 'test 123' }],
            bees: [{ bee_name: 'simple_bee', params: '{"param":"value"}' }],
          });
        });
    });
  });

  describe('uploadFiles', () => {

    it('should throw an error if config not initialized', () => {
      const bees = new Bees();

      return bees.uploadFiles()
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(TypeError);
          expect(err.message).toBe('Illegal State: Default config has not been set yet.');
        });
    });

    it('should return ErrorResponse', () => {
      FileUtils.upload.mockReturnValue(Promise.reject({ message: 'error' }));

      const bees = new Bees({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' }, { get: () => ({ cursor: 'userId' }) });

      return bees.uploadFiles([])
        .then(() => expect(false).toBe(true)) // this will never happen
        .catch((err) => {
          expect(err).toBeInstanceOf(ErrorResponse);
          expect(err.code).toBe(400);
          expect(err.error.message).toBe('error');
        });
    });

    it('should call file helper with files', () => {
      FileUtils.upload.mockReturnValue(Promise.resolve('success'));

      const bees = new Bees({
        apiKey: 'apiKey',
        apiSecret: 'apiSecret',
        apiUrlRoot: 'apiUrlRoot',
      }, { get: () => 'apiAccessToken' }, { get: () => ({ cursor: 'userId' }) });

      return bees.uploadFiles(['dog.png', 'cat.jpg'])
        .then((res) => {
          expect(res.result).toBe('success');

          expect(FileUtils.upload)
            .toHaveBeenCalledWith('apiUrlRoot', 'apiAccessToken', 'userId', 'outbox', ['dog.png', 'cat.jpg']);
        });
    });

  });

});
