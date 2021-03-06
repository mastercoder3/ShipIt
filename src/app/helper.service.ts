import { Injectable } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Http, RequestOptions,Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private modalService: NgbModal, private http: Http) { }

  openModel(content){
    this.modalService.open(content, {backdrop: 'static'});
  }

  closeModel(){
    this.modalService.dismissAll();
  }

  getCountries(){
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');    
       let options = new RequestOptions({ headers: myHeaders });
    return this.http.get('./assets/data/db.json',options)
    .pipe(map((this.extractData)))
  }

  extractData(res){
    let body = res.json();
    return body;
  }

  handleError (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
    }
    
  extractPrivilegs(data){
    return data.split(',');
  }

  setPrivilege(data){
    let privilege = '';
    if(data.c1 === true)
      privilege+="Ir,";
    if(data.c2 === true)
      privilege+="c,";
    if(data.c3 === true)
      privilege+="hr,";
    if(data.c4 === true)
      privilege+="tr,";
    if(data.c5 === true)
      privilege+="mo";

    return privilege;
  }


}
