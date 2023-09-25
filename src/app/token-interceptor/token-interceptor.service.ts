import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
    constructor() { }
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        let memberData = JSON.parse(localStorage.getItem('memberData'));
        
        // if authorization token already exists then dont add token - 3.1 api
        if(request.headers.get('Authorization') == null) {
            if (memberData != null) {
                const token = memberData.jwtToken;
                let isLoggedIn = true;
                if (token == null || token == '') {
                    isLoggedIn = false;
                }
                if (isLoggedIn == true) {
                    request = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }
            }
        }
        return next.handle(request);
    }
}