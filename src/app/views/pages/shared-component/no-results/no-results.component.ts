import { Component, Input } from '@angular/core';
import { color } from 'html2canvas/dist/types/css/types/color';

@Component({
  selector: 'kt-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss']
})
export class NoResultsComponent {
  @Input() show: boolean = true;
  @Input() icon: string = 'flaticon-danger';
  @Input() message: string = 'No results found!';
  @Input() textColor: string;
}
