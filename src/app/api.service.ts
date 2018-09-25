import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {admin} from './admin';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private afs: AngularFirestore) { }

    // Create Username
    createUser(uid, data){
      return this.afs.doc('users/'+uid).set(data);
    }
  
    //get User
    getUser(uid){
      return this.afs.doc('users/'+uid).valueChanges();
    }

    //get User data with meta
    getUserProfile(uid){
      return this.afs.doc('users/'+uid).snapshotChanges();
    }

    //Update User
    updateUser(uid,data){
      return this.afs.doc('users/'+uid).set(data);
    }
    
    //get Admin data
    getAdminData(uid){
      return this.afs.doc('admins/'+uid).valueChanges();
    }

    //create Admin
    createAdmin(uid, data){
      return this.afs.doc('admins/'+uid).set(data);
    }

    getAdminUsers(){
      return this.afs.collection<admin>('admins');
    }

    updateAdmin(uid, data){
      return this.afs.doc('admins/'+uid).set(data);
    }

    deleteAdmin(uid){
      return this.afs.doc('admins/'+uid).delete();
    }

    //Pricing
    getPricingCountry(dest){
      return this.afs.collection('pricing', ref=> ref.where('to', '==', dest)).valueChanges();
    }

    //AddPricingCountry
    addPricingCountry(data){
      return this.afs.collection('pricing').add(data);
    }

    // get country data
    getPricingCountryData(){
      return this.afs.collection('pricing').snapshotChanges();
    }

    //Add rates 
    addCountryRates(data){
      return this.afs.collection('rates').add(data);
    }

    //get Rates
    getCountryRates(id){
      return this.afs.collection('rates', ref => ref.where('id', '==', id)).snapshotChanges();
    }

    //update Rates
    updateCountryRates(id,data){
      return this.afs.doc('rates/'+id).set(data);
    }

    //delete rates
    deleteCountryRates(id){
      return this.afs.doc('rates/'+id).delete();
    }

    //delete country Pricing
    deleteCountryPricing(id){
      return this.afs.doc('pricing/'+id).delete();
    }

}