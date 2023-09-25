import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { ProductService } from '../../../provider/product-service/product-service.service';
import _ from 'lodash';

declare var window: any;
@Component({
  selector: 'kt-hsn-multi-select',
  templateUrl: './hsn-multi-select.component.html',
  styleUrls: ['./hsn-multi-select.component.scss']
})
export class HsnMultiSelectComponent implements AfterViewInit {
  @Input() data: any;
  @Input() includeDefaults: boolean = true;
  @Input() allowTags: boolean = false;
  @Output() onChange = new EventEmitter<any>();
  public selectRef: any;
  public defaultData: any = [
    { id: 0, text: 'None' },
    { id: 1, text: 'All' },
    { id: 2, text: 'General' },
    { id: 3, text: 'Consumer' }
  ];
  constructor(
    private el: ElementRef,
    private productService: ProductService,
    private cd: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    const self: any = this;
    this.selectRef = window
      .jQuery(this.el.nativeElement)
      .find('#bussinessCatagory');

    window.jQuery(this.selectRef).select2({
      multiple: true,
      tags: this.allowTags,
      maximumSelectionLength: 5,
      placeholder: "All",
      createTag: function (params) {
        var term = window.jQuery.trim(params.term);
        if (term === '') {
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
          self.productService.getAutoSuggestHsnSac(params.data).then(
            (result: any) => {
              success(result.suggestedHsnSac || []);
            },
            () => {
              success([]);
            },
          );
        },

        processResults: function (result) {
          let processedData = [];
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
    window.jQuery(this.selectRef).on('change', function (e: any) {
      let selectedCategories: any = [];
      _.each(self.selectRef.select2('data'), (item: any) => {
        selectedCategories.push({
          unsbcCode: item.id,
          name: item.text
        })
      });
      self.onChange.emit(selectedCategories);
    });

    // set the previously entered data
    let option: any;
    _.each(this.data, (item: any) => {
      option = new Option(item.name, item.unsbcCode, true, true);
      this.selectRef.append(option).trigger('change');
    });
  }

}