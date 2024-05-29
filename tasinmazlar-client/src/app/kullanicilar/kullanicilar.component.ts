import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as alertify from 'alertifyjs'

@Component({
  selector: 'app-kullanicilar',
  templateUrl: './kullanicilar.component.html',
  styleUrls: ['./kullanicilar.component.css']
})
export class KullanicilarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) { }

  isLoading = false;
  registerForm: FormGroup;
  registerUser: any = {};

  users = []
  selectedUsers: any[] = []

  ngOnInit() {
    this.getUsers();
    this.createRegisterForm();

  }


  getUsers() {
    this.httpClient.get<any>('http://localhost:42390/api/user').subscribe(
      response => {
        this.users = response;
      },
      error => {
        console.error('Taşınmazlar alınırken bir hata oluştu:', error);
      }
    );
  }


  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      mailadress: ["", Validators.required],
      password: ["", [Validators.required]],
      confirmPassword: ["", Validators.required],
      username: ["", Validators.required],
      userlastname: ["", Validators.required],
      useradress: [""],
      userrole: ["", Validators.required]
      
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ mismatch: true });

    } else {
      confirmPasswordControl.setErrors(null);
    } 
  }

  register() {
    this.isLoading = true;
    if (this.registerForm.valid) {
      this.registerUser = this.registerForm.value;
      this.authService.register(this.registerUser);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      } else {
        alertify.alert('Lütfen Girilen Bilgileri Kontrol Ediniz');
      } console.log("başarıyla oluşturuldu")
      
    }


    toggleCheckbox(event: any, users: any) {
      users.selected = event.target.checked;
      if(users.selected) {
        this.selectedUsers.push(users);
      } else {
        this.selectedUsers = this.selectedUsers.filter(selected => selected !== users);
      }
    }

    removeSelectedUsers() {
      if (this.selectedUsers.length === 0) {
        alertify.alert('Lütfen Silmek İstediğiniz Kullanıcıyı Seçiniz').set('basic', true); 
        return;
      }

      if(confirm('Seçilen Kullanıcıyı Silmek İstediğinizden Emin misiniz?')) {
        this.selectedUsers.forEach(users => {
          this.httpClient.delete(`http://localhost:42390/api/user/${users.id}`).subscribe(response => {
            console.log(response);
            this.users = this.users.filter((item: any) => item !== users);
          }),
          error => {
            console.error('Kullanıcı Silinirken Bir Hata Oluştu', error);
          }
        })
      }

    }


    closeAddUserModal() {
      const modal = document.getElementById("userAddModal");
      modal.style.display = "none";
      window.location.reload();
    }
















  }

