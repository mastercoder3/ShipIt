import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import {AuthService} from './../auth.service';
import {ApiService} from './../api.service';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css']
})
export class RegisterationComponent implements OnInit {

  error: boolean=false;
  errMsg;
  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private auth: AuthService, private api: ApiService) { }

  ngOnInit() {
    if(localStorage.getItem('uid'))
    {
      this.router.navigate(['/dashboard/home']);
    }
    
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.email
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$')
      ])]
    });
  }

  get f() { return this.form.controls; }

  onSubmit(email, password){
    if(localStorage.getItem('uid'))
    {
      localStorage.removeItem('uid');
    }
    this.auth.signup(email,password)
      .then(res =>{

        this.api.createUser(res.user.uid, {email: email, password: password})
        .then(data1 =>{
            localStorage.setItem('uid', res.user.uid);
            this.router.navigate(['/login']);          
        }, e =>{
          console.log(e);         
          this.error = true;
          this.errMsg ='User Cannot be Created';
        });
        
        this.auth.sendVerificationEmail()
        .then(data => {
          console.log('Email Sent');
        }, verError =>{
          console.log(verError);
        });

      }, err=>{
        this.error=true;
        this.errMsg= err;
      });
  } 

}
