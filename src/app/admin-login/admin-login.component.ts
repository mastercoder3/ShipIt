import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import {ApiService} from './../api.service';
import {AuthService} from './../auth.service';
import {HelperService} from './../helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  form: FormGroup;
  error: boolean=false;
  errMsg;
  constructor(private router: Router, private fb: FormBuilder, private api: ApiService, private auth: AuthService, private toastr: ToastrService, private helper: HelperService) { }

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
        Validators.required
      ])]
    });
  }

  get f() { return this.form.controls; }


  onSubmit(email, password, content){
    if(localStorage.getItem('uid'))
      localStorage.removeItem('uid');

    this.auth.login(email,password)
      .then(res =>{
        if(res.user.emailVerified === true){
        this.auth.setPersistance().then(() => {
          this.api.getAdminData(res.user.uid)
          .subscribe(data =>{
              if(data){
                localStorage.setItem('uid', res.user.uid);
                this.router.navigate(['/dashboard/home']);
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
        this.helper.closeModel();
          this.toastr.success('Verification', 'Email Sent! Check your inbox.');
      }, err=>{
        this.toastr.error('Error!', 'Email not Sent!');
      });
  }

}
