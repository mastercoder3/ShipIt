import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import {AuthService} from './../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

  form: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private auth: AuthService, private toast: ToastrService) { }

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
      ])]
    });
  }

  get f() { return this.form.controls; }

  sendRecoverEmail(email){
    this.auth.forgotPassword(email)
      .then(data =>{
          this.toast.success('Email Sent! Check your inbox.', 'Forogt Password');
      });
  }

}
