import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) { }

  login(email, password){
    return  this.auth.auth.signInWithEmailAndPassword(email,password);
  }

  signup(email,password){
    return this.auth.auth.createUserWithEmailAndPassword(email,password);

  }

  sendVerificationEmail(){
    return this.auth.auth.currentUser.sendEmailVerification();
  }

  getCurrentUser(){
    return this.auth.auth.currentUser;
  }

  getCurrentUserEmailStatus(){
      if(this.auth.auth.currentUser !== null)

        return this.auth.auth.currentUser.emailVerified;
      else
        return false;
  }

  setPersistance(){
    return this.auth.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
  }


}
