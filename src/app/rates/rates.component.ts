import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../helper.service';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {

  id;
  form: FormGroup;
  showSpinner: boolean = true;
  items;
  userFilter ={
    maxweight: ''
  };
  newItems;

  constructor(private route: ActivatedRoute, private roouter: Router, private fb: FormBuilder,
    private api: ApiService, private toastr: ToastrService, private helper: HelperService) { }

  ngOnInit() {
    this.route.params.subscribe(detials =>{
      this.id=detials.id;
      this.getData(this.id);
    });

    this.form = this.fb.group({
      minweight: ['', Validators.required],
      maxweight: ['', Validators.required],
      price: ['', Validators.required]
    });
  }


  Add(form){
    let data = {
      id: this.id,
      minweight: form.value.minweight,
      maxweight: form.value.maxweight,
      price: form.value.price
    };
    this.api.addCountryRates(data)
      .then(res =>{
        this.toastr.success("Rates Added Successfully","Adding Rates!");
      }, err=>{
        console.log(err);
      })
  }

  getData(id){
     this.api.getCountryRates(id)
      .pipe(map(actions=> actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.items = res;
          this.showSpinner = false;
        });
  }

  edit(item, content){
    this.newItems= item;
    this.helper.openModel(content);
  }

  update(){
    let data = {
      minweight: this.newItems.minweight,
      maxweight: this.newItems.maxweight,
      price: this.newItems.price,
      id: this.newItems.id
    };
    this.api.updateCountryRates(this.newItems.did,data)
      .then(res=>{
        this.toastr.success("Data Updated Successfully.","Data updation");
        this.helper.closeModel();
      }, err=>{
        console.log(err);
      });
  }

  delete(item){
    console.log(item.did);
    
    this.api.deleteCountryRates(item.did)
      .then(res =>{
        this.toastr.error("Data Deleted Successfully!", "Deleteion");
      }, err=>{
        console.log(err);
      })
  }

}
