import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import {AuthService} from './../auth.service';
import {ApiService} from './../api.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  form: FormGroup;
  user;
  privilege;

  constructor(private router: Router, private fb: FormBuilder, private auth: AuthService, private api: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.form = this.fb.group({
      fname: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      lname: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.email
      ])],
      cnic: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      address: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      c1: [true],
      c2: [false],
      c3: [false],
      c4: [false],
      c5: [false],
      detail: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])]

    });
  }

  submit(form){

    this.setPrivilege(form);

    this.user ={
      firstName: form.value.fname,
      lastName: form.value.lname,
      email: form.value.email,
      password: '123456',
      cnic: form.value.cnic,
      branchAddress: form.value.address,
      privileges: this.privilege,
      detail: form.value.detail
    }

    this.auth.signup(this.user.email, "123456")
      .then(res => {
        this.api.createAdmin(res.user.uid, this.user)
          .then(Response => {
            this.toastr.success("User Create Successfully!", "Add User");
            this.router.navigate(['/dashboard/home']);
          }, err=>{
            console.log(err);
          });
      });


  }

  setPrivilege(form){
    this.privilege = '';
    if(form.value.c1 === true)
      this.privilege+="Ir,";
    if(form.value.c2 === true)
      this.privilege+="c,";
    if(form.value.c3 === true)
      this.privilege+="hr,";
    if(form.value.c4 === true)
      this.privilege+="tr,";
    if(form.value.c5 === true)
      this.privilege+="mo";
  }

}
