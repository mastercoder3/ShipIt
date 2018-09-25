import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { HelperService } from '../helper.service';
import {Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  countries;
  form: FormGroup;
  form1: FormGroup;
  firstForm: boolean = true;
  secondForm: boolean = false;
  thirdForm: boolean = true;
  fourthForm: boolean = false;
  selected;
  vweight: number = 0;
  order;
  address;

  constructor(private helper: HelperService,
    private router: Router, private fb: FormBuilder
    ) { 
   }

  ngOnInit() {
    this.helper.getCountries()
      .subscribe(res =>{
        this.countries = res;
      });

      this.form = this.fb.group({
       destination: ['', Validators.required],
       from: ['', Validators.required],
       weight: [0, Validators.required],
       length: [0, Validators.required],
       width: [0, Validators.required],
       height: [0, Validators.required]
      });

      this.form1 = this.fb.group({
        paddress: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
        daddress: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
        name: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        mobile: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        units: [0, Validators.required]
      });

  }

  get f() { return this.form.controls; }

  submit(form){
    if(form.valid === true && 
      (form.value.weight >0 && form.value.length >0 && form.value.width>0 && form.value.height>0) )
    {
      this.order = {
        to: form.value.destination,
        from: form.value.from,
        weight: (this.getWeight()>form.value.weight)? this.getWeight() : form.value.weight,
        length: form.value.length,
        width: form.value.width,
        height: form.value.height
      };
      this.firstForm = false;
      this.secondForm = true;
      this.fourthForm = true;

    }
  }
  
  getWeight(){
    return (this.form.value.length*this.form.value.width*this.form.value.height)/5000;
  }

  check(){
    if(this.selected === 'Pickup & Drop Service')
    {
      this.thirdForm = false;
      this.fourthForm = true;
    }
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
