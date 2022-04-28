import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, concat, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { concatMap, debounceTime, distinctUntilChanged, exhaustMap, filter, map, mergeAll, mergeMap, switchMap, takeUntil, takeWhile, tap, toArray } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms'; 

import { AppService } from './app.service';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { IPeopleClient, IResponse } from './shared/interface';
import { DataMapper } from './shared/mapper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  public searchForm = new FormGroup({
    searchInput: new FormControl(''),
  });

  public itemHeight = 40;
  public nextPage: string | null = null;
  public prevPage: string | null = null;
  public loadType: 'scroll' | 'page' = 'scroll'
  public count: number = 0;
  public data:IPeopleClient[] = [];

  private numberOfItems = 10;
  private pageSubject$ = new BehaviorSubject(1);

  private pageByScroll$ = fromEvent(window, "scroll").pipe(
    map(() => window.scrollY),
    filter(current => current >=  document.body.clientHeight - window.innerHeight),
    debounceTime(200),
    distinctUntilChanged(), 
    map(y => Math.ceil((y + window.innerHeight)/ (this.itemHeight * this.numberOfItems)))
  );

  private pageToLoad$ = merge(this.pageSubject$, this.pageByScroll$).pipe(
    takeWhile( _ => this.loadType === 'scroll'),
    distinctUntilChanged()
  );
    

  constructor(private appService: AppService){}

  ngOnInit(){
    this.initInfinityScroll();

    this.searchForm.get('searchInput')!.valueChanges.pipe(
      filter(text => text.length > 2 || text.length === 0),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap( text => this.appService.search(text).pipe(
        tap( res => {
          this.count = res.count;
          this.nextPage = res.next;
          this.prevPage = res.previous;
        }),
        map(res => res.results.map(p => DataMapper.transformToClient(p))))
      )
    ).subscribe(people => {
      this.data = people
      if(this.data.length < this.count && this.loadType === 'scroll'){
        this.pageSubject$.next(1)
      }
    }
    )
  }

  changeLoadType(){
    this.loadType = this.loadType === 'scroll' ? 'page' : 'scroll';

    if(this.loadType === 'page'){
      this.initLoadByPage();
    }else{
      this.initInfinityScroll();
  }
  this.pageSubject$.next(1);
}

  public get page() : number {
    return this.pageSubject$.value;
  }
  
  public changePage(page: number){
    this.pageSubject$.next(page)
  }


  private initInfinityScroll(){
   this.pageToLoad$.pipe(
      mergeMap((page) => 
         this.appService.getData(page).pipe(
          tap(res => this.count = res.count),
          map(res => res.results.map(p => DataMapper.transformToClient(p))),
          tap(res => {
            if((this.itemHeight * this.numberOfItems * page) < window.innerHeight) {
              this.pageSubject$.next(page + 1);
            }
          })
          )
      )
    ).subscribe( people => this.data  = [...this.data, ...people]);
  }

  private initLoadByPage(): void {
    this.pageSubject$.pipe(
      takeWhile( _ => this.loadType === 'page'),
      mergeMap(page => 
        this.appService.getData(page).pipe(
          tap( res => {
            this.count = res.count,
            this.nextPage = res.next
            this.prevPage = res.previous
          }),
          map(res => res.results.map(p => DataMapper.transformToClient(p))))
        ) 
      ).subscribe(people => this.data =people);
  }

  
}



