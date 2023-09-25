import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "kt-unsubscribe-ns",
  templateUrl: "./unsubscribe-ns.component.html",
  styleUrls: ["./unsubscribe-ns.component.scss"],
})
export class UnsubscribeComponent implements OnInit {
  isUnsubscribe: boolean = false;
  constructor(private cd: ChangeDetectorRef) {}
  ngOnInit() {}
}
