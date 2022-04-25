import { IPeople, IPeopleClient } from "./interface";



export class DataMapper {
  public static transformToClient(people: IPeople): IPeopleClient {
    const { birth_year, name, mass, height } = people;
    return {
        birthYear: birth_year,
        name,
        mass,
        height
    }
  }

}