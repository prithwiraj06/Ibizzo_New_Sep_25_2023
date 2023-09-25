import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import { ProductService } from "../../../provider/product-service/product-service.service";
import _ from "lodash";
declare var window: any;

@Component({
  selector: "kt-business-category-lookup",
  templateUrl: "./business-category-lookup.component.html",
  styleUrls: ["./business-category-lookup.component.scss"],
})
export class BusinessCategoryLookupComponent implements AfterViewInit {
  @Input() data: any;
  @Input() includeDefaults: boolean = true;
  @Input() allowTags: boolean = false;
  @Output() onChange = new EventEmitter<any>();
  @Input() placeHolder: any;
  @Input() width: any;

  public selectRef: any;
  public defaultData: any = [
    { id: 1, text: "All" },
    { id: 2, text: "General" },
    { id: 3, text: "Consumer" },
  ];
  constructor(
    private el: ElementRef,
    private productService: ProductService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    console.log("ddsadsa", this.data);

    const self: any = this;
    this.selectRef = window
      .jQuery(this.el.nativeElement)
      .find("#businessCategoryNameSelector");
    window.jQuery(this.selectRef).select2({
      multiple: true,
      tags: this.allowTags,
      selectOnClose: true,
      maximumSelectionLength: 5,
      placeholder: this.placeHolder ? "All" : "",
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

      language: {
        noResults: function (params) {
          return self.includeDefaults
            ? "Type your buyer industry"
            : "Type your business category.";
        },
      },

      ajax: {
        delay: 250,
        data: function (params) {
          return params.term;
        },

        transport: function (params, success) {
          self.productService.getProductDetails(params.data).then(
            (result: any) => {
              success(result.suggestedCategories || []);
            },
            () => {
              success([]);
            }
          );
        },

        processResults: function (result) {
          let processedData = [].concat(self.includeDefaults ? [] : []);
          _.each(result, (item: any) => {
            processedData.push({
              id: item._source.category_unspsc_code,
              text: item._source.category_unspsc_name,
            });
          });
          return {
            results: processedData,
          };
        },
      },
    });

    if (this.width) {
      let doc: any = document.getElementsByClassName("select2-container");
      doc[0].style.width = "100%";
    }

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

  setCategory(code) {
    console.log("hello");
    var option = new Option(code.name, code.categoryId, true, true);
    this.selectRef.append(option).trigger("change");
  }
}
