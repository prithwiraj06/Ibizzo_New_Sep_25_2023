import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as _ from "underscore";
import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";

// Used to store key value pairs
interface Event {
  key: string;
  value: any;
}

@Injectable({
  providedIn: "root",
})
export class BaseService {
  protected _eventsSubject = new Subject<Event>();
  emailPattern = /^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/;
  pincode = /^[0-9]{6}$/;
  phoneNumber = /^[0-9]{10}$/;
  userName = /^[a-zA-Z]+$/;
  constructor(private http: HttpClient) {}

  public broadcastEvent(key: string, value: any) {
    this._eventsSubject.next({ key, value });
  }

  public onEvent(key: string): Observable<any> {
    return this._eventsSubject.asObservable().pipe(
      filter((e) => e.key === key),
      map((e) => e.value)
    );
  }

  public unsubscribe() {
    this._eventsSubject.unsubscribe();
  }

  get(action: string, options: any) {
    return this._get(environment.API_URL, action, options);
  }

  post(action: string, data: any, options?: any, header?: any) {
    return this._post(environment.API_URL, action, data, options, header);
  }
  patch(action: string, data: any, options?: any, header?: any) {
    return this._patch(environment.API_URL, action, data, options, header);
  }
  _get(url: string, action: string, options: any) {
    let query_params: string = "";
    _.each(options, (value, key) => {
      query_params += `${key}=${value}&`;
    });
    url = `${url}${action}?${query_params}`;

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      );
    });
  }

  _post(url: string, action: string, data: any, options?: any, header?: any) {
    if (options) {
      action = action + "?" + this.query(options);
    }
    url = `${url}${action}`;
    // const httpHeaders = new HttpHeaders();
    // httpHeaders.set('Content-Type', 'application/json');

    return new Promise((resolve, reject) => {
      this.http.post(url, data, header).subscribe(
        (res) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      );
    });
  }
  _patch(url: string, action: string, data: any, options?: any, header?: any) {
    if (options) {
      action = action + "?" + this.query(options);
    }
    url = `${url}${action}`;
    return new Promise((resolve, reject) => {
      this.http.patch(url, data, header).subscribe(
        (res) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      );
    });
  }
  getCaptch(action: string, options: any) {
    const query_params: string = this.query(options);
    let url: string = `${environment.API_URL}${action}?${query_params} { headers, responseType: 'text' as 'json', withCredentials: true }`;

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      );
    });
  }

  getItemsByParams(action: string, options: any) {
    const query_params: string = this.query(options);
    let url: string = `${environment.API_URL}${action}?${query_params}`;

    return new Promise((resolve, reject) => {
      this.http.post(url, null).subscribe(
        (res) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      );
    });
  }

  query(options: any) {
    let query_params: string = "";
    _.each(options, (value, key) => {
      query_params += `${key}=${value}&`;
    });
    return query_params;
  }

  getImageUrl(image: any, getType: string = "GetDownload") {
    return `${environment.API_URL}Upload/${getType}?filename=${image.replace(
      /['"]+/g,
      ""
    )}`;
  }

  getRazorPay(path: any, params: any) {
    console.log(path);

    return new Promise((resolve, reject) => {
      this.http.post(path, params).subscribe(
        (res) => {
          console.log(res, ":sdd");

          resolve(res);
        },
        (err: any) => {
          console.log(err, "ssf");

          reject(err);
        }
      );
    });
  }

  removeSpaces(name: string, changeCase?: boolean) {
    name = (name || "")
      .replace(/^\s+|\s+$/g, "")
      .replace(/  +/g, " ")
      .replace(/\./g, "")
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/\-/g, "-")
      .replace(/ /g, "-");
    return changeCase ? name.toLowerCase() : name;
  }
  LogIn(data) {
    return this.post("User/AuthenticateUserAsync", data);
  }
}
