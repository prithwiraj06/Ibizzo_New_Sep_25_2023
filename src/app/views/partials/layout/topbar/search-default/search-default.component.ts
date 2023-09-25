import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { BaseUrlPipe } from "../../../../../core/_base/layout/pipes/base-url";
import { MinisiteService } from "../../../../../../provider/minisite/minisite.service";
import {environment} from '../../../../../../environments/environment'

@Component({
  selector: "kt-search-default",
  templateUrl: "./search-default.component.html",
  styleUrls: ["./search-default.component.scss"],
})
export class SearchDefaultComponent {
  option: number = 1;
  searchTypes: any = [
    { text: "Products", value: 1 },
    { text: "Services", value: 2 },
    { text: "Company Name", value: 3 },
  ];


  // Set icon class name
  @Input() icon = "flaticon2-search-1";

  // Set true to icon as SVG or false as icon class
  @Input() useSVG: boolean;
  searchText: any = {};

  @ViewChild("searchInput", { static: true }) searchInput: ElementRef;

  data: any[];
  result: any[];
  loading: boolean;
  isCheckForMinisite: boolean = true;

  constructor(
    private router: Router,
    private baseUrlPipe: BaseUrlPipe,
    private service: MinisiteService
  ) {
    service.onEvent("HEADER").subscribe(() => {
      console.log("Search");
      this.isCheckForMinisite = false;
    });
    console.log("init", JSON.parse(localStorage.getItem("searchText")));
    if (
      JSON.parse(localStorage.getItem("searchText")) &&
      window.location.href.includes("m/p/s")
    ) {
      this.searchText.text = JSON.parse(localStorage.getItem("searchText"));
    }
  }
  ngOnInit(){
    // let arr = window.location.href.split("/");
    // let list = arr[arr.length - 1].split(".html")[0];
    // let data=list.replace(/\-/g, " ");
    // this.searchText.text=data
  }

  checkUrl() {
    let arr = window.location.href.split("/");
    let list = arr[arr.length - 1].split("-");
    list[list.length - 1].includes("p");
    return list[list.length - 1].includes("p");
  }

  searchContent() {

    if (this.searchText.text) {
      this.loading=true;
      setTimeout(()=>{
      this.loading=false;
      },500)
      let url =environment.SEO_URL+'/search-items/'+ this.searchText.text.replace(/ /g, "-") + ".html";
      
      // this.searchText.text=''
      // this.router.navigate(["/m/p/s/" + url]);


      localStorage.setItem("searchText", JSON.stringify(this.searchText.text));
      window.open(url,'_self');
    }
  }
}
