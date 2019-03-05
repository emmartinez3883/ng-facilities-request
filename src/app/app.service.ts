import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, Request, RequestOptions } from '@angular/http';
import { Department } from './department';
import { Building } from './building';
import { Floor } from './floor';
import { Room } from './room';
import { FacsRequest } from './facsrequest';
import { iRequest } from './irequest';
import { environment } from '../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

@Injectable()
export class appService {
    private pomApiUrl: string =  environment.apiUrl;
    private pomApiKey: string = environment.apiKey;
    constructor(
        private http: Http
    ) { }

    //Pomona API methods
    getDepartments(): Observable<Department[]> {
        return this.http.get(`${this.pomApiUrl}/depts?api_key=${this.pomApiKey}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getBuildings(): Observable<Building[]> {
        return this.http.get(`${this.pomApiUrl}/bldgs?api_key=${this.pomApiKey}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getFloors(bldg): Observable<Floor[]> {
        return this.http.get(`${this.pomApiUrl}/floors/${bldg}?api_key=${this.pomApiKey}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getRooms(floor): Observable<Room[]> {
        return this.http.get(`${this.pomApiUrl}/rooms/${floor}?api_key=${this.pomApiKey}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createiRequest(facsRequest: FacsRequest): Observable<iRequest> {
        return this.http.post(`${this.pomApiUrl}/createrequest?api_key=${this.pomApiKey}`, facsRequest)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //handlers
    private extractData(res: Response) {
        let body = res.json();
        return body || [];
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg || error); // log to console instead
        return Observable.throw(errMsg || error);
    }
} 
