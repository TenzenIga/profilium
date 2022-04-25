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
  public nextPage = new EventEmitter();

  @Output()
  public prevPage = new EventEmitter();
  
  public onNextClick(): void {
    this.nextPage.emit()
  }

  public onPrevClick(): void {
    this.prevPage.emit()
  }

}
