import { Component, OnInit } from "@angular/core";
import {
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { PartnerService } from "../../../provider/partner/partner.service";
import _ from "lodash";
declare var window: any;

@Component({
  selector: "kt-oranization-lookups",
  templateUrl: "./oranization-lookups.component.html",
  styleUrls: ["./oranization-lookups.component.scss"],
})
export class OranizationLookupsComponent implements AfterViewInit {
  @Input() data: any;
  @Output() onChange = new EventEmitter<any>();
  public selectRef: any;
  public orgSacDescription: any = [];
  @Input() allowTags: any = true;
  constructor(
    private el: ElementRef,
    private partner: PartnerService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    const self: any = this;
    this.selectRef = window
      .jQuery(this.el.nativeElement)
      .find("#orgNameSelector");

    window.jQuery(this.selectRef).select2({
      multiple: true,
      tags: this.allowTags,
      maximumSelectionLength: 5,
      placeholder: "All",
      createTag: function (params) {
        var term = window.jQuery.trim(params.term);
        if (term === "") {
          return null;
        }
        return {
          id: term,
          text: term,
          newTag: true, // add additional parameters
        };
      },

      ajax: {
        delay: 250,
        data: function (params) {
          return params.term;
        },

        transport: function (params, success) {
          let data = self.partner.getCachedPartnersSearch(params.data);
          if (data) {
            success(data || []);
          } else {
            success([]);
          }
        },

        processResults: function (result) {
          let processedData = [];
          _.each(result, (item: any) => {
            console.log("result", item.isView);
            if (item.isView) {
              processedData.push({
                id: item.id,
                text: item.name,
              });
            }
          });

          return {
            results: processedData,
          };
        },
      },
    });

    // attach on-change trigger
    window.jQuery(this.selectRef).on("change", function (e: any) {
      let selectedCategories: any = [];
      _.each(self.selectRef.select2("data"), (item: any) => {
        selectedCategories.push({
          unsbcCode: item.id,
          name: item.text,
        });
      });
      self.onChange.emit(selectedCategories);
    });

    // set the previously entered data
    let option: any;
    _.each(this.data, (item: any) => {
      option = new Option(item.name, item.unsbcCode, true, true);
      this.selectRef.append(option).trigger("change");
    });
  }
}
