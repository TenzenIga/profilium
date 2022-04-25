import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPeople, IResponse } from 'src/app/shared/interface';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = 'https://swapi.dev/api/people';

  constructor(private http: HttpClient) { }

  public getData(page:number = 1):Observable<IResponse>{
    return this.http.get<IResponse>(`${this.url}/?page=${page}`)
  }

  public search(query: string):Observable<IResponse>{
    return this.http.get<IResponse>(`${this.url}/?search=${query}`);
  }

  
}
