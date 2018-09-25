import { Component, OnInit } from '@angular/core';
import { HelperService } from '../helper.service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {

  countries;
  showSpinner: boolean = true;
  from;
  form: FormGroup;
  notExist: boolean;
  isCountry;
  items;
  userFilter={
    to:''
  };


  constructor(private helper: HelperService, private toastr: ToastrService, private api: ApiService,
     private fb: FormBuilder, private router: Router) { }

  ngOnInit() {

    this.getData();
    this.helper.getCountries()
      .subscribe(res =>{
        this.countries = res;
      });
      
      this.form = this.fb.group({
        destination: ['', Validators.required],
        from: ['', Validators.required]
       });
  }


  //initialize data
  getData(){
     this.api.getPricingCountryData().pipe(map(actions =>actions.map(a =>{
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return {id, ...data};
    })))
      .subscribe(res =>{
        this.items = res;
        this.showSpinner = false;
      });
  }

  edit(item){
    this.router.navigate(['/dashboard/rates', {id: item.id}]);
  }


  Add(form){
    this.notExist = false;
    if((form.value.destination && form.value.from) && (form.value.destination.name !== form.value.from.name)){
      this.isCountry = this.api.getPricingCountry(form.value.destination.name)
      .subscribe(res => {
        if(res){
          console.log('yes');
        }
        if(res.length === 1){
          this.notExist = true;  
          this.toastr.error("Country Already Exists!","Error While Adding");
        }
        else if(this.notExist === false && res.length === 0){
          this.notExist = false;
          this.isCountry.unsubscribe();
          this.api.addPricingCountry({to: form.value.destination.name, from: form.value.from.name})
            .then(response =>{
              this.notExist = true;
              this.isCountry.unsubscribe();
              this.toastr.success("Country Added Successfully!","Country Pricing");
            }, err=>{
              console.log(err);
            });

        }
      });
      if(this.notExist === false){
        
      }
    }
    else{
      this.toastr.error("Please Enter valid To and From.", "Data not Valid!");
    }
  }

  delete(item){
    this.api.deleteCountryPricing(item.id)
      .then(res =>{
        this.deleteRates(item.id);
        this.toastr.success('Pricing country deleted Successfully.',"Record Deleted");

      },err =>{
        console.log(err);
      })

  }

  deleteRates(id){
    let items;
     this.api.getCountryRates(id)
    .pipe(map(actions=> actions.map(a => {
      const did = a.payload.doc.id;
      return {did};
    })))
      .subscribe(res =>{
        items = res;
        items.forEach(a=>{
          this.api.deleteCountryRates(a.did);
        });
      });
  }



  // Autocomplete for country name
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.countries.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

    formatter = (x: {name: string}) => x.name;


}
