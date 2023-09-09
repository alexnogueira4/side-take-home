import AppDataSource, { seedDb } from '../../dataSource';
import { IMessage, IProperties, IProperty } from '../IProperty';
import { PropertyService } from '../PropertyService';

describe('PropertyService', () => {
  let propertyService: PropertyService;

  beforeAll(async () => {
    await AppDataSource.initialize();
    await seedDb();
  });

  beforeEach(() => {
    propertyService = new PropertyService();
  });

  it('should get all properties', async () => {
    const response: IProperties = await propertyService.findAll();

    expect(response).toBeDefined();
    expect(response.page).toEqual(1);
    expect(response.limit).toEqual(10);
    expect(response.total).toEqual(126);
    expect(response.totalPages).toEqual(13);
    expect(response.data.length).toBeGreaterThanOrEqual(1);
  });

  it('should get a property by id', async () => {
    const id = 1;
    const response: IProperty | null = await propertyService.getById(id);

    expect(response).toEqual({
      id: 1,
      address: '74434 East Sweet Bottom Br #18393',
      price: 20714261,
      bedrooms: 2,
      bathrooms: 5,
      type: null
    });
  });

  it('should create a new property', async () => {
    const data: IProperty = {
      address: '999 Default Street #56',
      price: 12343210,
      bedrooms: 1,
      bathrooms: 1,
      type: null,
    };
    const response: IMessage = await propertyService.create(data);

    expect(response).toEqual({
      status: 'success',
      message: 'Property has been saved'
    });
  });

  it('should return null if property does not exist', async () => {
    const id = 100000;
    const response: IProperty | null = await propertyService.getById(id)
    expect(response).toEqual(null);
  });

  it('should update a property by id', async () => {
    const id = 1;
    const payload: IProperty = {
      address: '999 Default Street #56',
      price: 12343210,
      bedrooms: 10,
      bathrooms: 1,
      type: "Townhouse"
    };

    const response: IMessage | null = await propertyService.update(payload, id);

    expect(response).toEqual({
      data: {
        ...payload,
        id
      },
      message: "Property updated successfully",
      status: "success",
    });
  });

  it('should delete a property by id', async () => {
    const id = 1;
    const response = await propertyService.delete(id);

    expect(response).toEqual({
      status: 'success',
      message: 'Property deleted successfully'
    });
  });

  it('should return null if property does not exist', async () => {
    const id = 10000;
    const response = await propertyService.delete(id);

    expect(response).toEqual(null);
  });
});