import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../services/user.service';
import { Role, RoleService } from '../services/roles.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './update.component.html'
})

export class UpdateUserDialogComponent implements OnInit {
  updateForm: FormGroup;
  roles: Role[] = [];
  updateUserButton = true;

  supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  selectedLanguage = 'en';


  
  constructor(
    private dialogRef: MatDialogRef<UpdateUserDialogComponent>,
    private fb: FormBuilder,
    private roleService: RoleService,
    private translate: TranslateService,
    private languageService: LanguageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateForm = this.fb.group({
      id: [this.data.id],
      username: [this.data.username, Validators.required],
      password: [this.data.password, Validators.required],
      roleName: [this.data.roleName, Validators.required]
    });
    this.translate.setDefaultLang(this.selectedLanguage);
    if(languageService.getCurrentLanguage()) 
      this.selectedLanguage = languageService.getCurrentLanguage();
  }
  ngOnInit(): void {
    this.loadRoles();
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
  onCancel(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    this.updateUserButton = true;
    if (this.updateForm.valid) {
      const user: User = this.updateForm.value;
      this.dialogRef.close(user);
    }
    // Save the updated user details and close the dialog
  }
  getUserControl(controlName: string): AbstractControl {
    return this.updateForm.get(controlName) as AbstractControl;
  }

  onLanguageChange() {
    this.languageService.setLanguage(this.selectedLanguage);
  }
}
