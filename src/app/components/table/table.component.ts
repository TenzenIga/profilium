import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {IPeopleClient } from 'src/app/shared/interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  @Input()
  public height!:number;

  @Input()
  public data!:IPeopleClient[];

  @Input()
  public loadType!: 'page'|'scroll';

  identify(index: number, item: IPeopleClient): string {
    return item.name;
  }
}
