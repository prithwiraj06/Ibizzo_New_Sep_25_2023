import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { ProductService } from "../../../provider/product-service/product-service.service";
import _ from "lodash";
declare var window: any;

@Component({
  selector: "kt-hsn-lookup",
  templateUrl: "./hsn-lookup.component.html",
  styleUrls: ["./hsn-lookup.component.scss"],
})
export class HsnLookupComponent implements AfterViewInit {
  @Input() data: any;
  @Output() onChange = new EventEmitter<any>();
  public selectRef: any;
  public hsnSacDescription: string;
  constructor(
    private el: ElementRef,
    private productService: ProductService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    const self: any = this;
    this.selectRef = window
      .jQuery(this.el.nativeElement)
      .find("#hsnNameSelector");

    window.jQuery(this.selectRef).select2({
      ajax: {
        delay: 250,
        data: function (params) {
          return params.term;
        },

        transport: function (params, success) {
          self.productService.getAutoSuggestHsnSac(params.data).then(
            (result: any) => {
              success(result.suggestedHsnSac || []);
            },
            () => {
              success([]);
            }
          );
        },

        processResults: function (result) {
          let processedData = [{ id: 0, text: "None" }];
          _.each(result, (item: any) => {
            processedData.push({
              id: item._source.hsnsac_code,
              text: item._source.hsnsac_code,
            });
          });

          return {
            results: processedData,
          };
        },
      },
    });

    // attach on-change trigger
    window.jQuery(this.selectRef).on("select2:select", function (e: any) {
      self.onChange.emit(e.params.data);
      self.getHSNDescription(e.params.data.text);
    });

    // set the previously entered data
    if (this.data && this.data.text) {
      var option = new Option(this.data.text, this.data.id, true, true);
      this.getHSNDescription(this.data.text);
      this.selectRef.append(option).trigger("change");
    }
  }

  getHSNDescription(code: string) {
    this.productService.getAutoSuggestDescription(code).then((result: any) => {
      if (result && result.hsnSacDescription) {
        this.hsnSacDescription = result.hsnSacDescription;
        this.cd.detectChanges();
      }
    });
  }

  setHsnCode(code) {
    var option = new Option(code.text, code.id, true, true);
    this.getHSNDescription(code.text);
    this.selectRef.append(option).trigger("change");
  }
  resetHsn() {
    this.selectRef.val(null).trigger("change");
    this.hsnSacDescription = "";
  }
}
