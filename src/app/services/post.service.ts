import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { PostConfiguration } from '../post-configuration';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    protected defaultHeaders = new HttpHeaders();
    protected configuration = new PostConfiguration();
    protected basePath = 'https://airporticobackend.azurewebsites.net';

    constructor(private http: HttpClient) {
    }

    /**
     * Generic post operation - always POST with this service
     * @param postBody - body to send over
     * @param postUrl - URL to post to
     * @param observe - observing the ...
     * @param reportProgress - should it report the progress
     */
    public post(postBody: object, postUrl: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public post(postBody: object, postUrl: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public post(postBody: object, postUrl: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public post(postBody: object, postUrl: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
        if (postBody === null || postBody === undefined || !postUrl) {
            throw new Error('Required parameter was null or undefined when calling generic post service.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.http.post<any>(`${this.basePath}/${postUrl}`,
            postBody,
            {
                withCredentials: this.configuration.withCredentials,
                headers,
                observe,
                reportProgress
            }
        );
    }

    public mockGet(getUrl: string): Observable<any> {
        return this.http.get('./assets/_mock/' + getUrl);
    }

    /**
     * Convert date string into yyyy-mm-dd string
     */
    getDateConverted(date: string, separator: string = '-') {
        const d = new Date(date);
        const mm = d.getUTCMonth() + 1 < 10 ? '0' + (d.getUTCMonth() + 1).toString() : d.getUTCMonth() + 1;
        const dd = d.getUTCDate() < 10 ? '0' + d.getUTCDate().toString() : d.getUTCDate();
        const yy = d.getUTCFullYear();
        return yy + separator + mm + separator + dd;
    }
    get<T>(url: string): Observable<T> {
        return this.http.get<T>(`${this.basePath}/${url}`);
      }
}
