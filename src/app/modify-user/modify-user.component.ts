import { Component, OnInit } from '@angular/core';
import {ApiService} from './../api.service';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestoreCollection} from '@angular/fire/firestore';
import {admin} from './../admin';
import {HelperService} from './../helper.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit {

  showSpinner: boolean = true;
  user: Observable<admin[]>;
  users: AngularFirestoreCollection<admin>;
  items;
  updatedUser;
  userFilter={
    email:''
  };

  constructor(private api: ApiService, private helper: HelperService, private toastr: ToastrService) { }

  ngOnInit() {
    this.users = this.api.getAdminUsers();
    this.user = this.users.snapshotChanges().pipe(
      map(action => action.map(a => {
        const data = a.payload.doc.data() as admin;
        const id = a.payload.doc.id;
        const selected = 0;
        return {id, selected, ...data};
      }))
    );
    this.user.subscribe(res => {
      this.items = res;
      this.showSpinner= false;
    });    
  }

  edit(content, item){
    this.helper.openModel(content);
    let data = this.helper.extractPrivilegs(item.privileges);
    this.updatedUser = item;
    this.setValues(data);
  }

  setValues(data){
    for(var i=0; i<data.length; i++){
      switch(data[i]){
        case 'Ir':
          this.updatedUser.c1=true;
          break;
        case 'c':
          this.updatedUser.c2=true;
          break;
        case 'hr':
          this.updatedUser.c3=true;
          break;
        case 'tr':
          this.updatedUser.c4=true;
          break;
        case 'mo':
          this.updatedUser.c5=true;
          break;
      }
    }
  }

  update(){
    let data = {branchAddress: this.updatedUser.branchAddress, cnic: this.updatedUser.cnic, detail: this.updatedUser.cnic, email: this.updatedUser.email,
    firstName: this.updatedUser.firstName, lastName: this.updatedUser.lastName, password: this.updatedUser.password, privileges: this.helper.setPrivilege(this.updatedUser)}
    this.api.updateAdmin(this.updatedUser.id, data)
      .then(res =>{
        this.toastr.success("User Updated Successfully!", "Update Info");
        this.helper.closeModel();
      }, err=>{
        console.log(err);
      });
  }

  delete(item){
    this.api.deleteAdmin(item.id)
      .then(res =>{
        this.toastr.success("User Deleted Successfully!","User deleted");
      }, err=>{
        console.log(err);
      })
  }

  

}
