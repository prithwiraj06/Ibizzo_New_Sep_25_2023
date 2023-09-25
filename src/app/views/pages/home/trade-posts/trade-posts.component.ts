import { Component, OnInit } from "@angular/core";
import { MinisiteService } from "../../../../../provider/minisite/minisite.service";

@Component({
  selector: "kt-trade-post",
  templateUrl: "./trade-posts.component.html",
  styleUrls: ["./trade-posts.component.scss"],
})
export class TradePostsComponent implements OnInit {
  constructor(
    private service: MinisiteService,
  ) {
    this.service.broadcastEvent("SEARCH", null);
  }

  ngOnInit() {}
}
