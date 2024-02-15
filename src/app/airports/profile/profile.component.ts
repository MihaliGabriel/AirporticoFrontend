import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators
import { Person, PersonService } from '../../services/person.service';
import { empty } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['/profile.component.css']
})
export class ProfileComponent implements OnInit {
    personForm: FormGroup; // Define the FormGroup
    
    isFieldsDisabled = true;

    nameNotUniqueMessage = '';

    supportedLanguages = [
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' },
        // Add more languages as needed
      ];
    
      selectedLanguage = 'en';

    constructor(private personService: PersonService, private dialog: MatDialog, private fb: FormBuilder,
        private translate: TranslateService,
        private languageService: LanguageService) {
        this.personForm = this.fb.group({
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            phoneNumber: [null, [Validators.required, Validators.pattern("[0-9]{10}")]],
            birthDate: [null] // Add Validators.required
        });
        this.translate.setDefaultLang(this.selectedLanguage);
        if(languageService.getCurrentLanguage()) 
          this.selectedLanguage = languageService.getCurrentLanguage();
    }

    ngOnInit() {
        const emptyPerson: Person = {
            id: BigInt(0),
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            userId: BigInt(0),
            birthDate: new Date(0)
          };
        
        const idString: string = localStorage.getItem('id') ?? '';
        const id = BigInt(idString);
        emptyPerson.userId = id;
        this.personService.getPersonByUser(id).subscribe(emptyPerson => {
            this.personForm.get('firstName')?.setValue(emptyPerson.firstName);
            this.personForm.get('lastName')?.setValue(emptyPerson.lastName);
            this.personForm.get('email')?.setValue(emptyPerson.email);
            this.personForm.get('phoneNumber')?.setValue(emptyPerson.phoneNumber);
            console.log(emptyPerson);
        })
    }

    addPerson(person: Person): any {
        const idString: string = localStorage.getItem('id') ?? '';
        const id = BigInt(idString);
        person.userId = id;
        this.isFieldsDisabled = true;
        const emptyPerson: Person = {
            id: BigInt(0),
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            userId: BigInt(0),
            birthDate: new Date(0)
          };
        this.personService.getPersonByUser(id).subscribe(emptyPerson => {});
        console.log(emptyPerson.id);
        if(emptyPerson.id == BigInt(0)) {
            this.personService.createPerson(person).subscribe((person: any) => {
                console.log("Information saved succesfully");
            },
                (error: string) => {
                    this.nameNotUniqueMessage = error;
                    console.log(error); 
                });
        }
        else {  
            person.id = emptyPerson.id;
            console.log('Person to update in addPerson' + person);
            this.personService.updatePerson(person).subscribe(person => {});
        }
        
    }

    toggleFields() {
        console.log('toggleFields called');
        this.isFieldsDisabled = false; // Toggle the state
    }

    onLanguageChange() {
        this.languageService.setLanguage(this.selectedLanguage);
      }
//     updatePerson(person: Person) {
//         const dialogRef = this.dialog.open(UpdateRoleDialogComponent, {
//             data: role
//         });
//         dialogRef.afterClosed().subscribe(updatedRole => {
//             if (updatedRole) {
//                 console.log(updatedRole);
//                 this.roleService.updateRole(updatedRole).subscribe(() => {
//                     console.log(updatedRole);
//                     const index = this.roles.findIndex(u => u.id === updatedRole.id);
//                     if (index !== -1) {
//                         this.roles[index] = updatedRole;
//                     }
//                 },
//                     (error: any) => {
//                         this.nameNotUniqueMessage = error;
//                         console.error('Error updating user: ', error);
//                     });
//             }
//         });
//     }

// }
}
