import { BlockProducer } from '../types/BlockProducer';
import axios from "axios";

jest.mock('axios', () => {
    return {
      create: jest.fn(() => ({
        get: jest.fn(),
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() }
        }
      }))
    }
  })

describe('HttpClient', () => {
    it('calls create with baseURL', async () => {
        const methodSpy = jest.spyOn(axios, 'create');
        new BlockProducer('test')
        const expected = { "baseURL": "test"};
        expect(methodSpy).toHaveBeenCalledWith(expected);
    })
});