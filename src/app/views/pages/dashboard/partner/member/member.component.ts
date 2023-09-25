import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  Input,
} from "@angular/core";


@Component({
  selector: "kt-member",
  templateUrl: "./member.component.html",
  styleUrls: ["./member.component.scss"],
})
export class MemberComponent implements OnInit {
  @Input() search: any
  constructor(
  ) { }

  ngOnInit() {
  }

}