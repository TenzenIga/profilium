import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent{
  @Input()
  public count!: number;
  @Input()
  public loadType!:'scroll' | 'page';

  @Output()
  public toggleLoadType = new EventEmitter();

  onClick(){
    this.toggleLoadType.emit()
  }
}
