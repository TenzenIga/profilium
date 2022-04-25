import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mergeMap, switchMap, takeWhile, tap } from 'rxjs/operators';

import { AppService } from './app.service';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { IPeopleClient, IResponse } from './shared/interface';
import { DataMapper } from './shared/mapper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy{
  public page: number = 1;
  public next: string | null = null;
  public previous: string | null = null;
  public count:number = 0;
  public data:IPeopleClient[] = [];
  public loadType:'scroll' | 'page' = 'page';
  public itemHeight = 40;

  private searchSubscription$: Subscription | undefined;
  private numberOfItems = 10;
  private pageByManual$ = new BehaviorSubject(1);

  private pageByScroll$ = fromEvent(window, "scroll").pipe(
    map(() => window.scrollY),
    filter(current => current >=  document.body.clientHeight - window.innerHeight),
    debounceTime(200),
    distinctUntilChanged(), 
    map(y => Math.ceil((y + window.innerHeight)/ (this.itemHeight * this.numberOfItems))));
   
  private pageToLoad$ = merge(this.pageByManual$, this.pageByScroll$).pipe(
    distinctUntilChanged(),
  );

  @ViewChild(SearchInputComponent)
  input!:SearchInputComponent;

  constructor(private appService: AppService){}

  ngAfterViewInit(){
    this.searchSubscription$ = this.input.searchForm.get('searchInput')?.valueChanges.pipe(
      filter(text => text.length > 2 || text.length === 0),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap( text =>  this.appService.search(text)),
    ).subscribe((res: IResponse) => {
      this.count = res.count;
      this.previous = res.previous;
      this.next = res.next;
      this.data = res.results.map(item => DataMapper.transformToClient(item));
    })
  }

  public ngOnInit(): void {
    this.getDataByPage(this.page);    
  }

 public getDataByPage(page: number = 1){
    this.appService.getData(page).subscribe(res => {
      this.count = res.count;
      this.previous = res.previous;
      this.next = res.next;
      this.data = res.results.map(item => DataMapper.transformToClient(item));
    })
  }

  public goNextPage(){
    this.page++;
    this.getDataByPage(this.page)
  }
  public goPrevPage(){
    this.page--;
    this.getDataByPage(this.page)
  }

  public changeLoadType(): void {
    this.page = 1;
    this.data = [];
    this.pageByManual$.next(1);
    
    this.loadType = this.loadType === 'page' ? 'scroll' : 'page';
     
    if(this.loadType === 'scroll'){
      this.pageToLoad$.pipe(
        mergeMap((page:number)=>{
          return this.appService.getData(page).pipe(
            takeWhile(_ => this.loadType === 'scroll'),
            map((res: IResponse) => res),
            tap(res => {
              this.data = [ ...this.data, ...res.results.map(item => DataMapper.transformToClient(item))];
              if((this.itemHeight * this.numberOfItems * page) < window.innerHeight) {
                this.pageByManual$.next(page + 1);
              }
            })
          )
        }),
      ).subscribe();
    }else{
      this.getDataByPage(1)
    }
    
  }

  ngOnDestroy(): void {
    this.searchSubscription$?.unsubscribe(); 
  }

}
