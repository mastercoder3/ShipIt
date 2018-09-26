import { Component, OnInit, HostListener } from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { HelperService } from '../helper.service';
import {Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import { ApiService } from '../api.service';
import {environment} from './../../environments/environment';
import * as myGlobal from './../../global';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { ToastrService } from 'ngx-toastr';

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
  cData;
  prices;
  total={price: 0,
  total: 0};
  handler: any;
  amount: number;
  

  constructor(private helper: HelperService,
    private router: Router, private fb: FormBuilder, private api: ApiService,
    private http: Http, private toastr: ToastrService
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

      this.setStripes();

  }

  get f() { return this.form.controls; }

  submit(form){
    if(form.valid === true && 
      (form.value.weight >0 && form.value.length >0 && form.value.width>0 && form.value.height>0) )
    {
      this.order = {
        to: form.value.destination.name,
        from: form.value.from.name,
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

  finish(form, content){
    if(form.valid == true && 
      (form.value.units > 0)){

        this.address = {
          pickupAddress: form.value.paddress,
          dropOffAddress: form.value.daddress,
          name: form.value.name,
          email: form.value.email,
          contactNo: form.value.mobile,
          units: form.value.units,
          amount: 0,
          userId: localStorage.getItem('uid'),
          orderStatus: 'pending',
          paymentMethod: '',
          ratePerItem: 0,
          date: ''
        };

        this.api.getCountryName(this.order.to)
          .pipe(map(actions => actions.map(a=>{
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return{did, ...data};
          })))
            .subscribe(res =>{
              this.cData = res;
              if(res.length === 1){
              
                this.api.getCountryPrices(this.cData[0].did,this.order.weight)
                   .pipe(map(actions => actions.map(a=>{
                     const data = a.payload.doc.data();
                     const did = a.payload.doc.id;
                     return {did, ...data};
                   })))
                    .subscribe(res=>{
                      this.prices = res;
                      let found = false;
                      this.prices.forEach(a => {
                        if(this.order.weight > a.minweight && this.order.weight <= a.maxweight){
                          this.total.price = a.price;
                          this.total.total = a.price * this.address.units;
                          this.address.ratePerItem = a.price;
                          this.address.amount = this.total.total;
                          let date = new Date();
                          this.address.date = date;
                          this.helper.openModel(content);
                          found = true;
                        }
                      });
                      if(found == false){
                        this.toastr.info("Weight limit Exceeded. Contact Admin!","Weight Limit");
                      }
                    });
              }
              else{
                
              }
            });
        
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


    //Stripes intialization

    setStripes(){
      this.handler = myGlobal.StripeCheckout.configure({
        key: environment.stripeKey,
        image: 'https://firebasestorage.googleapis.com/v0/b/chatapp-5d576.appspot.com/o/hezvad8c32q?alt=media&token=ab155a77-9d6e-4ae8-8917-b50711c6bdf6',
        locale: 'auto',
        token: token =>{
         this.simpleHttp(this.amount, token).subscribe(res=>{
           if(res.status === 200)
           {
            //  this.pay.processPayment(token, this.amount);
            const bill = Object.assign(this.order,this.address);
            this.api.setBill(bill)
              .then(res =>{
                this.api.processPayment(res.id,this.total.total, token)
                  .then(Response => {
                    console.log(Response);
                  },err => {
                    console.log(err);
                  });
              }, error => {
                console.log(error);
              });
           }
         })
        }
      });
    }

    simpleHttp(amount, token){
      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: myHeaders });
  
      //callrequest
      return this.http.post('http://localhost:3000/payments', {
       amount: this.amount.toString(),
       token: token
      }, options);
  
    }

    pay(){
      this.address.paymentMethod = 'Credit Card';
      this.helper.closeModel();
      this.amount = this.total.total;
      this.amount= this.amount * 100;
      this.handler.open({
        name: 'Payment',
        description: 'Deposit Funds to Account'
      });
    }

    @HostListener('window:popstate')

    onPopState(){
      this.handler.close();
    }



}
