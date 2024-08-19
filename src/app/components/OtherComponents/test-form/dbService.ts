import { Injectable, ɵɵresolveBody } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Md5} from 'ts-md5/dist/md5';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

//import { stringify } from 'querystring';

var headers_object = new HttpHeaders();
headers_object.append('Content-Type', 'application/json');
headers_object.append("Authorization", "Basic " + btoa("username:password"));



var header = {
    headers: new HttpHeaders()
      .set('Authorization',  `Basic ${btoa("ADMIN:test123")}`)
  }
  
  var headers_object = new HttpHeaders();
  headers_object.append('Content-Type', 'application/json');
  headers_object.append("Authorization", "Basic " + btoa("username:password"));
  
  const httpOptions = {
    headers: headers_object
  };
  
  
  var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${btoa("ADMIN:test123")}`)
    }
  

@Injectable({ providedIn: 'root' })
export class dbService {
    public fullurl: string;
    public url_all: string;
    constructor(private http: HttpClient) {
    }

    

  

   
    getData(page, body) {
        
            this.url_all = "http://localhost:8090/api?_format=json";
            
            const headers = { 'Authorization': "Basic " + btoa("STAR:star") } ;
        
       
            this.url_all = this.url_all + page;
        console.log("before calling:"+ this.url_all)
       return this.http.post<any>(this.url_all, body ,{ headers} )
           .pipe(
            catchError((err) => {
              console.log(err)
              return throwError(err);
            }),
            map(result => {
            
                console.log(result)

                return result;
            }));
           

           
    }
    


}