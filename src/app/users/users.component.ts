import { Component, Inject, OnInit } from '@angular/core';
import { User, UserService } from '../services/user.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UpdateUserDialogComponent } from './update.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { Role, RoleService } from '../services/roles.service';
import { AirportErrorComponent } from '../airports/airporterror.component';
import { LanguageService } from '../services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  userForm: FormGroup; // Define the FormGroup
  nameNotUniqueMessage = '';
  addUserButton = false;
  users: User[] = [];
  roles: Role[] = [];

  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 4;

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';



  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private roleService: RoleService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required], 
      password: ['', Validators.required], 
      roleName: ['', Validators.required]  
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit() {
    this.loadRoles();
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.currentPage, this.itemsPerPage)
    .subscribe(response => {
      this.users = response.content;
      this.totalPages = response.totalPages;
    });
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe(
      roles => {
        this.roles = roles;
      },
      error => {
        console.error('Error in fetching roles: ', error);
      }
    );
  }

  addUser(user: User): any {
    this.addUserButton = true;
    if(this.userForm.valid) {
      this.userService.createUser(user).subscribe(user => {
        this.users.push(user);
        this.userForm.reset(); // Reset the form after successful submission
      },
      error => {
        console.log(error);
        this.nameNotUniqueMessage = error;
      });
    }
  }

  updateUser(user: User) {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      data: user
    });
    dialogRef.afterClosed().subscribe(updatedUser => {
      if (updatedUser) {
        console.log(updatedUser);
        this.userService.updateUser(updatedUser).subscribe((updatedUser) => {
          console.log(updatedUser);
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
        },
          (error: any) => {
            this.showError(error);
            console.error('Error updating user: ', error);
          });
      }
    });
  }

  
  showError(errorMessage: string): void {
    const dialogRef = this.dialog.open(AirportErrorComponent, {
      width: '300px', // Set the width of the dialog
      data: { errorMessage },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed:', result);
    });
  }
  
  searchUsers(user: User) {
    this.userService.searchUsers(user).subscribe(
      data => {
        this.users = data;  
        this.userForm.reset();
      },
      error => {
        console.error('Error in searching users:', error);
      }
    )
  }

  deleteUser(id: BigInt) {
    this.userService.deleteUser(id).subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Error in fetching users after delete: ', error);
      }
    )
  }

  getUserControl(controlName: string): AbstractControl {
    return this.userForm.get(controlName) as AbstractControl;
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadUsers();
    }
  }
  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }

}