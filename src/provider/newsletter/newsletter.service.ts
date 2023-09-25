import { Injectable } from '@angular/core';
import { BaseService } from '../base-service/base.service'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService extends BaseService {

  constructor(
    private _http: HttpClient) {
    super(_http);
  }

  getDraftNewsLetter(params) {
    return this.post('Flyers/GetDraftNewsLetterTemplates', undefined, params)
  }

  deleleteTemplete(params) {
    return this.post('Flyers/DelNewsLetterTemplateById', undefined, params)
  }

  getSubscribers(data: any) {
    const params: any = data
    return this.post('Flyers/GetSubScribers', undefined, params)
  }

  getNonSubscribers(data: any) {
    const params: any = data
    return this.post('Flyers/GetNonSubScribers', undefined, params)
  }

  getAllTemplates(data: any) {
    const params: any = data
    return this.post('Flyers/GetAllNewsLetterTemplates', undefined, params)
  }

  createTemplates(data: any) {
    const params: any = {
      Token: 'IBizzo'
    }
    return this.post('Flyers/CreateNewsLetterTemplate', data, params)
  }

  updateTemplates(data: any) {
    const params: any = {
      Token: 'IBizzo'
    }
    return this.post('Flyers/UpdateNewsLetterTemplate', data, params)
  }

  getNewsletterHistory(data: any) {
    return this.post('Flyers/GetNewsLetterHistory', undefined, data)
  }

  processNewsLetter(data: any) {
    return this.post('Flyers/ProcessNewsLetters', undefined, data)
  }

  getNewsletterById(data: any) {
    return this.post('Flyers/GetNewsLetterTemplateById', undefined, data)
  }

  updateTemplate(data: any) {
    return this.post('Flyers/UpdateNewsLetterTemplate', undefined, data)
  }

}
