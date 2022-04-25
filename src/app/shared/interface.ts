

export interface IResponse {
    count: number
    next: string | null
    previous: string | null
    results: IPeople[] 
}

export interface IPeople {
    birth_year: string
    height: string
    mass: string
    name: string
}

export interface IPeopleClient {
    birthYear: string
    height: string
    mass: string
    name: string
  }
  