import { Component, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import _ from 'lodash';
declare var window: any;
import { DigitalFlyerService } from '../../../provider/digital-flyers/digital-flyer.service'
@Component({
  selector: 'kt-location-lookups',
  templateUrl: './location-lookups.component.html',
  styleUrls: ['./location-lookups.component.scss']
})
export class LocationLookupsComponent implements AfterViewInit {
  @Input() data: any;
  @Input() includeDefaults: boolean = true;
  @Input() allowTags: boolean = false;
  @Output() onChange = new EventEmitter<any>();
  public selectRef: any;
  LOCATION: any;
  public defaultData: any = [
  ];
  constructor(
    private el: ElementRef,
    private productService: DigitalFlyerService,
    private cd: ChangeDetectorRef
  ) {
  }


  ngAfterViewInit() {
    const self: any = this;
    this.selectRef = window
      .jQuery(this.el.nativeElement)
      .find('#locationNameSelector');

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
          let data = self.productService.getCachedLocationSearch(params.data);
          if (data) {
            success(data || []);
          }
          else {
            success([]);
          }
        },

        processResults: function (result) {
          let processedData = [].concat(self.includeDefaults ? self.defaultData : []);
          _.each(result, (item: any, i: any) => {
            processedData.push({
              id: i,
              text: item
            });
          });
          return {
            results: processedData
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