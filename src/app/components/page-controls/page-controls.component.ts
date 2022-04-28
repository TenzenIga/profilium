import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-page-controls',
  templateUrl: './page-controls.component.html',
  styleUrls: ['./page-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageControlsComponent {
  @Input()
  public page!:number;

  @Input()
  public previous!: string | null;

  @Input()
  public next!: string | null;

  @Output() 
  public pageChange = new EventEmitter()
  
  public onNextClick(): void {
    this.pageChange.emit(this.page + 1)
  }

  public onPrevClick(): void {
    this.pageChange.emit(this.page - 1)
  }

}
