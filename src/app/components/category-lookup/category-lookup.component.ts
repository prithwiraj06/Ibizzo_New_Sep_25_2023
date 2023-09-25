import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import _ from "lodash";
import { ProductService } from "../../../provider/product-service/product-service.service";
declare var window: any;
@Component({
  selector: "kt-category-lookup",
  templateUrl: "./category-lookup.component.html",
  styleUrls: ["./category-lookup.component.scss"],
})
export class CategoryLookupComponent implements AfterViewInit {
  @Input() data: any;
  @Input() categories: any = [];
  @Input() customCategories: any = [];
  @Input() productId: number;
  @Output() onChange = new EventEmitter<any>();
  list: any = [];
  id: any;
  firstTag: any = 0;
  public customCategoriesLookup: any = [];
  public productCategoriesLookup: any = [];

  public selectRef: any;
  constructor(private el: ElementRef, private productService: ProductService) {}

  ngAfterViewInit() {
    console.log("data", this.data);
    const self: any = this;
    this.selectRef = window
      .jQuery(this.el.nativeElement)
      .find("#categoryNameSelector");

    window.jQuery(this.selectRef).select2({
      tags: true,
      multiple: true,
      createTag: function (params) {
        var term = window.jQuery.trim(params.term);
        if (term === "") {
          return null;
        }
        return {
          id: term,
          text: term,
          newTag: true,
        };
      },
      language: {
        noResults: function (params) {
          return "Type your product.";
        },
      },

      ajax: {
        delay: 200,
        data: function (params) {
          return params.term;
        },
        transport: async (params, success) => {
          if (!params.data) {
            success([]);
            return false;
          }

          try {
            let result_2: any = await self.productService.getProductCategoryByToken(
              params.data
            );
            let consolidated_result: any = [];
            consolidated_result = consolidated_result.concat(
              result_2.productCategorys || []
            );
            self.list = consolidated_result;
            success(consolidated_result);
          } catch (e) {
            success([]);
          }
        },
        processResults: function (result: any) {
          let processedData = [];
          _.each(self.list, (item: any) => {
            let _id: number = item.categoryId;
            let _text: any = item.name;
            processedData.push({
              id: _id,
              text: _text,
              categoryId: _id,
              productId: item.productId ? item.productId : 0,
              type: "productCategory",
            });
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
      let data: any = self.selectRef.select2("data");
      _.each(data, (item: any) => {
        if (self.productCategoriesLookup.indexOf(item.id) > -1) {
          item.type = "productCategory";
        } else if (self.customCategoriesLookup.indexOf(item.id) > -1) {
          item.customTag = true;
          item.type = "customCategory";
        } else {
          if (item.text == item.id) {
            item.type = "customCategory";
          } else {
            item.type = "productCategory";
          }
        }

        selectedCategories.push({
          categoryId: item.id,
          id: item.id,
          name: item.text,
          productId: item.productId ? item.productId : 0,
          newTag: !!item.newTag,
          type: item.type,
        });
      });
      self.onChange.emit(selectedCategories);
    });

    _.each(this.data, (item: any, index: number) => {
      this.data[index].name = item.name + " - " + item.categoryId;
      this.productCategoriesLookup.push(item.categoryId.toString());
    });

    _.each(this.customCategories, (item: any) => {
      this.customCategoriesLookup.push(item.categoryId.toString());
    });

    // set the previously entered data
    let options: any = []
      .concat(this.customCategories || [])
      .concat(this.data || []);
    let option: any;
    _.each(options, (item: any) => {
      console.log("options", options);
      option = new Option(item.name, item.categoryId, true, true);
      console.log("id", option);
      this.selectRef.append(option).trigger("change");
    });
  }
  setCategory(code) {
    var option = new Option(code.name, code.categoryId, true, true);
    this.selectRef.append(option).trigger("change");
  }
}
