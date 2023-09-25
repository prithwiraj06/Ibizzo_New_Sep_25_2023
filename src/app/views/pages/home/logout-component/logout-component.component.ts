import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import {environment} from '../../../../../environments/environment';
import {Logout} from '../../../../core/auth';


@Component({
  selector: 'kt-logout-component',
  templateUrl: './logout-component.component.html',
  styleUrls: ['./logout-component.component.scss']
})
export class LogoutComponentComponent implements OnInit {

  constructor(
    private store: Store<AppState>,

  ) { }

  ngOnInit() {
    debugger
    this.store.dispatch(new Logout());
    localStorage.removeItem("memberData");
    localStorage.removeItem("previousRfq");
    window.location.href = environment.SEO_URL;
  }

}
