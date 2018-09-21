import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import {ApiService} from './../api.service';
import {AuthService} from './../auth.service';
import {HelperService} from './../helper.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  error: boolean=false;
  errMsg;
  constructor(private router: Router, private fb: FormBuilder, private api: ApiService, private auth: AuthService, private helper: HelperService) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.email
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  get f() { return this.form.controls; }



  // open(content) {
  //   this.modalService.open(content, {backdrop: 'static'})
  // }

  onSubmit(email, password, content){
    if(localStorage.getItem('uid'))
      localStorage.removeItem('uid');

    this.auth.login(email,password)
      .then(res =>{
        if(res.user.emailVerified === true){
        this.auth.setPersistance().then(() => {
          this.api.getUser(res.user.uid)
          .subscribe(data =>{
              if(data){
                localStorage.setItem('uid', res.user.uid);
                this.router.navigate(['/verification']);
              }
              else{
                this.error = true;
                this.errMsg ='Login Failed';
              }
             });
        });     
      }
      else if (res.user.emailVerified === false){
        this.helper.openModel(content);
      }

      }, err =>{
        this.error = true;
        this.errMsg = err;
      })
  }

  resend(){
    this.auth.sendVerificationEmail()
      .then(data =>{
        console.log("Email Sent");
      }, err=>{
        console.log("Email Not Sent");
      });
  }

}
