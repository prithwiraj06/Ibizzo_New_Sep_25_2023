// Angular
import { Pipe, PipeTransform } from '@angular/core';
import { PartnerService} from "../../../../../provider/partner/partner.service"

@Pipe({
	name: 'baseurl'
})
export class BaseUrlPipe implements PipeTransform {
 
  constructor( public partnerService: PartnerService){}

	/**
	 * Transform
	 *
	 * @param value: any
	 * @param args: any
	 */
	transform(value: any): any {
    const partner: any = this.partnerService.getCurrentPartner();
    const baseUrl: string = '/' + partner.urlName + '/';

    const valueType: string = typeof value;
    function removeForwardSlash(firstValue: string){
      if(firstValue.charAt(0) == '/'){
        firstValue = firstValue.substr(1, firstValue.length);
      }
      return firstValue;
    }

    if(valueType == 'string'){
      value = removeForwardSlash(value);
      value = baseUrl + '/' + value;
    }

    if((valueType == 'object') && (value.length != undefined)){
      value[0] = removeForwardSlash(value[0]);
      value = [baseUrl].concat(value).join('');
    }

    return value;
	}
}
