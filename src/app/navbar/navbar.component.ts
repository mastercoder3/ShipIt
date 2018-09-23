import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from './../api.service';
import { map } from 'rxjs/operators';
import {HelperService} from './../helper.service';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import { ToastrService, Toast } from 'ngx-toastr';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  image: string='./../../assets/app-assets/images/user.png';
  user;
  form: FormGroup;
  opassword;

  constructor(private router: Router, private api: ApiService, private helper: HelperService, private fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit() {
    this.form = this.fb.group({
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$')
      ])],
      rpassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$')
      ])]
    });

    this.getUserInformation(localStorage.getItem('uid'));
  }

  get f() { return this.form.controls; }

  getUserInformation(id){
    this.api.getUserProfile(id).pipe(map(actions =>  {
      const user = actions.payload.data();
      const id = actions.payload.id;
      return {id, ...user};

    }))
      .subscribe(res =>{
        this.user = res;
      });      
  }

  logout(){
    localStorage.removeItem('uid');
    this.router.navigate(['/login']);
  }

  resetPassword(content){
    this.helper.openModel(content);
  }

  reset(form){
    if(form.value.password !== form.value.rpassword)
    {
      this.toastr.error("Password do not Match.", "Error!")
    }
    else if(form.value.password === form.value.rpassword && this.opassword === this.user.password){
      this.user.password = this.form.value.password;
      this.api.updateUser(localStorage.getItem('uid'), this.user)
        .then(res =>{
          this.toastr.success("Password Updated Successfully!","Reset Password");
          this.helper.closeModel();
        }, err=>{
          console.log(err);
          this.helper.closeModel();
        })
    }
  }

}
