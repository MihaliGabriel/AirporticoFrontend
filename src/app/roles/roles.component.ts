import { Component, OnInit } from '@angular/core';
import { Role, RoleService } from '../services/roles.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateRoleDialogComponent } from './updaterole.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { AirportErrorComponent } from '../airports/airporterror.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
  roleForm: FormGroup; // Define the FormGroup

  roles: Role[] = [];
  nameNotUniqueMessage='';

  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 4;

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  constructor(private roleService: RoleService, private dialog: MatDialog, private fb: FormBuilder,
            private translate: TranslateService, private languageService: LanguageService) {
    this.roleForm = this.fb.group({
      id: [null, Validators.required], // Add Validators.required
      name: [null, Validators.required]  // Add Validators.required
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getRoles(this.currentPage, this.itemsPerPage)
    .subscribe(response => {
      this.roles = response.content;
      this.totalPages = response.totalPages;
    },
    error => {
      console.log(error);
    });
  }

  addRole(role: Role): any {
    this.roleService.createRole(role).subscribe(role => {
      this.roles.push(role);
      this.roleForm.reset(); // Reset the form after successful submission
    },
    error => {
      this.nameNotUniqueMessage = error;
      console.log(error);
    });
  }

  updateRole(role : Role) {
    const dialogRef = this.dialog.open(UpdateRoleDialogComponent, {
      data: role
    });
    dialogRef.afterClosed().subscribe(updatedRole => {
      if(updatedRole) {
        console.log(updatedRole);
        this.roleService.updateRole(updatedRole).subscribe(() => {
          console.log(updatedRole);
          const index = this.roles.findIndex(u => u.id === updatedRole.id);
          if(index !== -1) {
            this.roles[index] = updatedRole;
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
  }
    
  searchRoles(role: Role) {
    this.roleService.searchRoles(role).subscribe(
      data => {
        this.roles = data;  
        this.roleForm.reset();
      },
      error => {
        console.error('Error in searching users:', error);
      }
    )
  }

  deleteRole(id : BigInt) {
    this.roleService.deleteRole(id).subscribe(
      data => {
        this.roles = data;
      },
      error => {
        console.error('Error in fetching users after delete: ', error);
      }
    )
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadRoles();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadRoles();
    }
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
