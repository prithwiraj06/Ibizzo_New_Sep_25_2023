// Angular
import { Component, Input ,OnInit,ChangeDetectorRef} from '@angular/core';

export interface ISearchResult  {
	icon: string;
	img: string;
	title: string;
	text: string;
	url: string;
}

@Component({
	selector: 'kt-search-result',
	templateUrl: './search-result.component.html',
	styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
	@Input() data:any;
	@Input() noRecordText: string;
	constructor(private cd:ChangeDetectorRef){		
	}

	ngOnInit(){
		this.cd.markForCheck()
	}
	
}
