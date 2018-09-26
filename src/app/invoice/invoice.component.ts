import { Component, OnInit } from '@angular/core';
import {ApiService} from './../api.service';
import {map} from 'rxjs/operators';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  userFilter={
    did: ''
  };
  items;
  showSpinner: boolean = true;
  invoice;

  constructor(private api: ApiService, private helper: HelperService) { }

  ngOnInit() {
    this.getData(localStorage.getItem('uid'));
  }

  getData(id){
    this.api.getOrder(id)
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
      .subscribe(res =>{
        this.items = res;
        this.showSpinner = false;
      });
      
  }

  detail(content, item){
    this.helper.openModel(content);
    // item.date = item.date.toDate();
    this.invoice = item;

  }



  getDate(date){
    let x =date.toDate();
    return new Date(x).toLocaleDateString()
  }


}
