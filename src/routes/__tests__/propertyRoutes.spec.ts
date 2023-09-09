import request from 'supertest';
import app from '../../app';
import AppDataSource, { seedDb } from '../../dataSource';
import { ERRORS } from '../../helpers';
import { IProperty } from '../../services/IProperty';

describe('propertyRoutes', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await seedDb();
  });

  describe('Get All Properties', () => {
    it('should return the first page of properties', async () => {
      const response = await request(app).get('/properties');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        data: expect.any(Array),
        page: 1,
        limit: 10,
        total: 126,
        totalPages: 13,
      });
      expect(response.body.data.length).toEqual(10);
      expect(response.body.data[0]).toEqual({
        id: 42,
        address: "20349 North LOST SPRING Fwy #27536",
        price: 1066737,
        bedrooms: 2,
        bathrooms: 1,
        type: "Townhouse"
      });
    });

    it('should return the second page of properties', async () => {
      const response = await request(app).get('/properties').query({
        page: 2,
        limit: 10,
      });

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        data: expect.any(Array),
        total: 126,
        page: "2",
        limit: "10",
        totalPages: 13,
      });
      expect(response.body.data.length).toEqual(10);
      expect(response.body.data[0]).toEqual({
        id: 80,
        address: '32738 South VISTA MADERA Lane #F16',
        price: 2893021,
        bedrooms: 2,
        bathrooms: 6,
        type: 'Townhouse',
      });
    });

    it('should filter properties', async () => {
      const response = await request(app)
        .get('/properties')
        .query({
          page: 1,
          limit: 10,
          search: 'south',
          minPrice: 1111111,
          maxPrice: 1222222222,
          bedrooms: 2,
          bathrooms: 6,
          type: 'Townhouse'
        });

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toEqual(3);
      expect(response.body).toMatchObject({
        data: expect.any(Array),
        total: 3,
        page: "1",
        limit: "10",
        totalPages: 1,
      });
      expect(response.body.data[0]).toEqual({
        id: 38,
        address: '32738 South VISTA MADERA Lane #F16',
        price: 2893021,
        bedrooms: 2,
        bathrooms: 6,
        type: 'Townhouse',
      });
    });

    it('should throw an error if params are invalid', async () => {
      const response = await request(app).get('/properties').query({
        page: 'test',
      });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        error: 'Validation Error',
        message: '"page" must be a number'
      });
    });
  });

  describe('Get Property by ID', () => {
    it('should return the property', async () => {
      const response = await request(app).get('/properties/1');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: 1,
        address: '74434 East Sweet Bottom Br #18393',
        price: 20714261,
        bedrooms: 2,
        bathrooms: 5,
        type: null,
      });
    });

    it('should throw if requested property does not exists', async () => {
      const response = await request(app).get('/properties/130');

      expect(response.status).toEqual(404);
      expect(response.body.error).toEqual(ERRORS.NOT_FOUND.errorName);
      expect(response.body.message).toEqual('Property not found');
    });

    it('should fail if path param is invalid', async () => {
      const response = await request(app).get('/properties/test');

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual(ERRORS.VALIDATION_ERROR.errorName);
      expect(response.body.message).toEqual('"id" must be a number');
    });
  });

  describe('Create new Property', () => {
    it('should create a new property', async () => {
      const payload: IProperty = {
        address: '999 Default Street #56',
        price: 12343210,
        bedrooms: 7,
        bathrooms: 9,
        type: 'House',
      };

      const response = await request(app).post('/properties').send(payload);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        message: "Property has been saved",
        status: "success",
      });
    });

    it('should throw error if required field is missing', async () => {
      const response = await request(app).post('/properties').send({
        address: '999 Default Street #56',
        price: 12343210,
        bathrooms: 6,
        type: null,
      });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual(ERRORS.VALIDATION_ERROR.errorName);
      expect(response.body.message).toEqual('"bedrooms" is required');
    });

    it('should throw error if field is invalid', async () => {
      const response = await request(app).post('/properties').send({
        address: '999 Default Street #56',
        price: 12343210,
        bedrooms: 2,
        bathrooms: "6s",
        type: null,
      });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual(ERRORS.VALIDATION_ERROR.errorName);
      expect(response.body.message).toEqual('"bathrooms" must be a number');
    });
  });

  describe('UPDATE property', () => {
    it('should update a property', async () => {
      const id = 1
      const payload: IProperty = {
        address: '999 Default Street #56',
        price: 12343210,
        bedrooms: 2,
        bathrooms: 2,
        type: 'House'
      }
      const response = await request(app).put(`/properties/${id}`).send(payload);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        message: "Property updated successfully",
        status: "success",
        data: {
          ...payload,
          id,
        },
      });
    });

    it('should throw if property does not exists', async () => {
      const response = await request(app).put('/properties/1000').send({
        address: '999 Default Street #56',
        price: 12343210,
        bedrooms: 2,
        bathrooms: 2,
        type: 'House'
      });
      expect(response.status).toEqual(404);
      expect(response.body.error).toEqual(ERRORS.NOT_FOUND.errorName);
      expect(response.body.message).toEqual('Property not found');
    });

    it('should throw if required field is missing', async () => {
      const response = await request(app).put('/properties/127').send({
        price: 12343210,
        bedrooms: 4,
        bathrooms: 3,
        type: 'House',
      });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual(ERRORS.VALIDATION_ERROR.errorName);
      expect(response.body.message).toEqual('"address" is required');
    });

    it('should throw if required field is invalid', async () => {
      const response = await request(app).put('/properties/127').send({
        address: '999 Default Street #56',
        price: 12343210,
        bedrooms: "test",
        bathrooms: 3,
        type: 'House',
      });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual(ERRORS.VALIDATION_ERROR.errorName);
      expect(response.body.message).toEqual('"bedrooms" must be a number');
    });
  });

  describe('DELETE property', () => {
    it('should delete a property', async () => {
      const response = await request(app).delete('/properties/1');

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual("Property deleted successfully");
      expect(response.body.status).toEqual("success");
    });

    it('should throw if property does not exists', async () => {
      const response = await request(app).delete('/properties/1000');

      expect(response.status).toEqual(404);
      expect(response.body.error).toEqual(ERRORS.NOT_FOUND.errorName);
      expect(response.body.message).toEqual('Property not found');
    });

    it('should throw if param is invalid', async () => {
      const response = await request(app).delete('/properties/test');

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual(ERRORS.VALIDATION_ERROR.errorName);
      expect(response.body.message).toEqual('"id" must be a number');
    });
  });

  describe('UNKNOWN endpoint', () => {
    it('should return Not Found', async () => {
      const response = await request(app).get('/properties-test');
      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual("Not Found");
    });
  });
});
