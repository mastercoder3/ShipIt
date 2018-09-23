import { Component, OnInit } from '@angular/core';
import { AngularFireStorage,  AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import {ApiService} from './../api.service';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  image: string='./../../assets/app-assets/images/user.png';
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  user;
  showSpinner: boolean = true;


  constructor(private api: ApiService, private fireStorage: AngularFireStorage, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.getUserInformation(localStorage.getItem('uid'));
  }

  upload(event){
    const id =  localStorage.getItem('uid');
    this.ref = this.fireStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.image = url;
          this.user.image = url;
          this.update();
        });
      })
    ).subscribe();

  }

  getUserInformation(id){
    this.api.getUserProfile(id).pipe(map(actions =>  {
      const user = actions.payload.data();
      const id = actions.payload.id;
      return {id, ...user};

    }))
      .subscribe(res =>{
        this.user = res;
        this.showSpinner = false;
      });      
  }

  update(){
    const id = localStorage.getItem('uid');
    this.api.updateUser(id, this.user)
      .then(res =>{
        this.toastr.success("Profile Update Successfully!", "Edit Profile");
        this.router.navigate(['/dashboard/home']);
      }, err =>{
        this.toastr.error("Information not updated!","Error!");
        console.log(err);
      })
  }

}
