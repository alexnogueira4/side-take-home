
import AppDataSource from '../dataSource';
import { Repository, Between, Like, MoreThanOrEqual } from 'typeorm';
import { Property } from '../entities';
import { IProperty, IParams, IProperties, IMessage } from './IProperty';

export class PropertyService {
  repository: Repository<Property>;
  constructor() {
    this.repository = AppDataSource.getRepository(Property);
  }

  /**
   * Returns all Properties with pagination and filter options.
   * @param params - The filters to search and paginate through the properties.
   * @returns A Promise with an array of properties and the pagination information.
   */
  async findAll(params: IParams = {}): Promise<IProperties> {
    let {
      limit = 10,
      page = 1,
      bedrooms = 0,
      bathrooms = 0,
      type,
      minPrice = 1,
      maxPrice = Number.MAX_VALUE,
      orderBy = 'price',
      order = "ASC",
      search
    } = params;

    const offSet = limit * (page - 1);
    const [data, total]: [IProperty[], number] = await this.repository.findAndCount(
      {
        take: limit,
        skip: offSet,
        where: {
          ...(search ? { address: Like(`%${search}%`) } : {}),
          price: Between(minPrice, maxPrice),
          bedrooms: MoreThanOrEqual(bedrooms),
          bathrooms: MoreThanOrEqual(bathrooms),
          type,
        },
        order: {
          [orderBy]: order
        }
      }
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      limit,
      total,
      totalPages
    };
  }

  /**
   * Returns a Property by its id.
   * @param id - The id of the Property to returned.
   * @returns A Promise with the found Property entity or null.
   */
  async getById(id: number): Promise<IProperty | null> {
    return this.repository.findOneBy({ id })
  }

  /**
   * Creates a new Property.
   * @param payload - The Property to be created.
   * @returns A Promise with a successful message.
   */
  async create(payload: IProperty): Promise<IMessage> {
    const property = new Property()

    property.address = payload.address;
    property.price = payload.price;
    property.bedrooms = payload.bedrooms;
    property.bathrooms = payload.bathrooms;

    await this.repository.save(property)
    return {
      status: "success",
      message: "Property has been saved"
    };
  }

  /**
   * Updates a Property by its id.
   * @param id - The id of the Property to update.
   * @param payload - The Property to be updated.
   * @returns A Promise with a successful message or null.
   */
  async update(payload: IProperty, id: number): Promise<IMessage | null> {
    const property: IProperty | null = await this.repository.findOneBy({ id });
    if (!property) {
      return null
    }

    property.address = payload.address;
    property.price = payload.price;
    property.bedrooms = payload.bedrooms;
    property.bathrooms = payload.bathrooms;
    property.type = payload.type;

    const updatedProperty = await this.repository.save(property);

    return {
      status: "success",
      message: "Property updated successfully",
      data: Object.assign(property, updatedProperty)
    }
  }

  /**
   * Deletes a Property by its id.
   * @param id - The id of the property to delete.
   * @returns A Promise with a successful message or null.
   */
  async delete(id: number): Promise<IMessage | null> {
    const property = await this.repository.findOneBy({ id })
    if (!property) {
      return null;
    }

    await this.repository.remove(property);

    return {
      status: "success",
      message: "Property deleted successfully"
    };
  }
}
