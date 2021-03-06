import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NGXLogInterface } from './types/ngx-log.interface';
export declare class NGXLoggerHttpService {
    private readonly http;
    constructor(http: HttpClient);
    logOnServer(url: string, log: NGXLogInterface, customHeaders: HttpHeaders): Observable<any>;
}
