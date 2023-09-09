import seedJson from '../../data/seed.json';
import AppDataSource, { seedDb } from '../../dataSource';
import {
  getByIdHandler,
  findAllHandler,
  createHandler,
  updateHandler,
  deleteHandler
} from '../Property';

describe('Property Controller', () => {
  let req = {} as any;
  let res = {} as any;
  const next = jest.fn().mockReturnThis();

  beforeAll(async () => {
    await AppDataSource.initialize();
    await seedDb();
  });

  beforeEach(() => {
    req = {
      query: {},
      params: {},
      body: {},
    } as any;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as any;
  });

  describe('findAll', () => {
    it('should get all properties', async () => {
      await findAllHandler(req, res, next);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('createHandler', () => {
    it('should create a new property', async () => {
      req.body = {
        address: '999 Default Street #56',
        price: 850200,
        bedrooms: 1,
        bathrooms: 1,
        type: "House",
      };

      await createHandler(req, res, next);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        status: expect.any(String),
        message: expect.any(String)
      }));
    });
  });

  describe('getByIdHandler', () => {
    it('should get a property by id', async () => {
      req.params = { id: 1 };

      await getByIdHandler(req, res, next);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(seedJson[0]);
    });

    it('should throw an error', async () => {
      req.params = { id: 'test' };
      const response = getByIdHandler(req, res, next);
      expect(response).rejects.toThrowError();
    });
  });

  describe('updateHandler', () => {
    it('should update a property by id', async () => {
      const id = 1;
      req.body = {
        address: '999 Default Street #56',
        price: 850200,
        bedrooms: 10,
        bathrooms: 1,
        type: null,
      };
      req.params = { id };

      await updateHandler(req, res, next);

      expect(res.send).toHaveBeenCalledTimes(1);

      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        status: "success",
        message: "Property updated successfully",
        data: expect.any(Object)
      }));
    });
  });

  describe('deleteOneById', () => {
    it('should delete a property by id', async () => {
      req.params = { id: 1 };

      await deleteHandler(req, res, next);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
        status: "success",
        message: "Property deleted successfully"
      }));
    });
  });
});