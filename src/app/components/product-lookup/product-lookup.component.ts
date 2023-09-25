import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { ProductService } from "../../../provider/product-service/product-service.service";
import _ from "lodash";
import { ToastrService } from "ngx-toastr";
declare var window: any;

@Component({
  selector: "kt-product-lookup",
  templateUrl: "./product-lookup.component.html",
  styleUrls: ["./product-lookup.component.scss"],
})
export class ProductLookupComponent implements AfterViewInit {
  @Input() data: any;
  @Input() type: any;
  @Output() onChange = new EventEmitter<any>();
  public selectRef: any;
  serachName: any;
  @Output() search = new EventEmitter<string>();

  constructor(
    private el: ElementRef,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit() {
    const self: any = this;
    this.selectRef = window
      .jQuery(this.el.nativeElement)
      .find(".productNameSelector");

    window.jQuery(this.selectRef).select2({
      tags: true,
      selectOnClose: true,
      multiple: true,

      maximumSelectionLength: 1,
      createTag: function (params) {
        var term = window.jQuery.trim(params.term);

        if (term === "") {
          return null;
        }
        if (/[,]/.test(term)) {
          self.toastr.error("Please enter only one product name");
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
          return "Type one of your " + self.type + " product.";
        },
      },

      ajax: {
        delay: 200,
        data: function (params) {
          return params.term;
        },

        transport: async (params, success) => {
          try {
            let result_1: any = await self.productService.getAutoSuggestProductByText(
              params.data
            );
            let result_2: any = await self.productService.getAutoSuggestDBProductBYText(
              params.data
            );
            this.serachName = params.data;
            this.search.emit(this.serachName);
            let consolidated_result: any = [];
            consolidated_result = result_1.suggestedProducts || [];
            consolidated_result = consolidated_result.concat(
              result_2.suggestedProducts || []
            );
            success(consolidated_result);
          } catch (e) {
            success([]);
          }
        },

        processResults: function (result) {
          let processedData = [];
          _.each(result, (item: any) => {
            let _id: number =
              item._source.product_unspsc_code || item._source.product_code;
            let _text: number =
              item._source.product_unspsc_Name || item._source.product_Name;
            processedData.push({
              id: _id,
              text: _text,
            });
          });

          return {
            results: processedData,
          };
        },
      },
    });

    let doc: any = document.getElementsByClassName("select2-container");
    doc[0].style.width = "100%";

    // attach on-change trigger
    window.jQuery(this.selectRef).on("select2:select", function (e: any) {
      let data: any = e.params.data;
      if (data.text.indexOf(" - ") > -1) {
        data.text = (e.params.data.text || "").split(" - ");
        data.text.pop();
        data.text = data.text.join("");
      }
      self.onChange.emit(data);
    });

    // attach while enter
    window.jQuery(this.selectRef).on("keypress", function (e: any) {
      let data: any = e.params.data;
      if (data.text.indexOf(" - ") > -1) {
        data.text = (e.params.data.text || "").split(" - ");
        data.text.pop();
        data.text = data.text.join("");
      }
      self.onChange.emit(data);
    });

    // set the previously entered data
    if (this.data && this.data.text) {
      if (parseInt(this.data.id)) {
        this.data.text = this.data.text + " - " + this.data.id;
      }
      var option = new Option(this.data.text, this.data.id, true, true);
      this.selectRef.append(option).trigger("change");
    }
  }
  resetProduct() {
    this.selectRef.val(null).trigger("change");
  }
}
