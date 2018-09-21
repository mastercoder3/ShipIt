import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from './../api.service';
import {AuthService} from './../auth.service';
import {AngularFirestoreDocument} from '@angular/fire/firestore';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  user;
  emailVerification: boolean;

  constructor(private api: ApiService, private router: Router, private auth: AuthService) { 

    // this.api.getUser(localStorage.getItem('uid')).subscribe(data => {
    //   this.user = data;
    //   this.emailVerification =this.user.emailVerified;
    // });


  }

  ngOnInit() {
    if(this.auth.getCurrentUser() === null){
      this.auth.login(localStorage.getItem('email'),localStorage.getItem('password'))
      .then(res =>{
        this.auth.setPersistance();
        console.log(this.auth.getCurrentUser());
        localStorage.setItem('uid', res.user.uid);
        this.getEmailStatus()
          .then(res =>{
            console.log(res);
            if(res){
              console.log('yess');
            }
          });
      }, err =>{
        console.log(err);
      });
    }

   // this.getEmailStatus();
  }

  resend(){
    this.auth.sendVerificationEmail()
      .then(data =>{
        console.log("Email Sent");
      }, err=>{
        console.log("Email Not Sent");
      })
  }

  async getEmailStatus(){
    if(this.auth.getCurrentUser())
    {
      let status = await this.auth.getCurrentUserEmailStatus();
    return status;
    }
    else
    console.log('error');
  }

  verified(x): Promise<boolean>{
    return new Promise(resolve =>{
      if(x === true){
        resolve(x);
      }
    });
  }

}
