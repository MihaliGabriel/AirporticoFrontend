import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';

export interface Person {
  id: BigInt;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userId: BigInt;
  birthDate: Date
}
@Injectable({
    providedIn: 'root'
})
export class PersonService {
    constructor(private postService: PostService) { }

    private personToJSON(person: Person): any {
        return {
            ...person,
            id: person.id?.toString(),
            userId: person.userId?.toString()
        };
    }

    getAllPeople(): Observable<Person[]> {
        const postBody = {};
        const postUrl = 'api/admin/people';
        return this.postService.post(postBody, postUrl);
    }

    getRoles(page: number, size: number): Observable<any> {
        const url =`api/roles?page=${page}&size=${size}`;
        return this.postService.get(url);
      }

    createPerson(person: Person): Observable<Person> {
        const postUrl = 'api/createperson';
        return this.postService.post(this.personToJSON(person), postUrl);
    }

    updatePerson(person: Person): Observable<Person> {
        const postUrl = 'api/updateperson';
        const postBody = this.personToJSON(person);
        console.log(postBody + " updated role in service");
        return this.postService.post(postBody, postUrl);
    }
    
    deletePerson(id: BigInt): Observable<Person[]> {
        const postBody = { id: id.toString() };
        const postUrl = 'api/deleteperson';
        console.log(postBody);
        return this.postService.post(postBody, postUrl);
    }

    searchPeople(person: Person): Observable<Person[]> {
        console.log(person);
        const postUrl = 'api/searchpeople';
        return this.postService.post(this.personToJSON(person), postUrl);
    }

    getPersonByUser(userId: BigInt): Observable<Person> {
        const postBody = {userId: userId.toString()};
        const postUrl = 'api/personbyuser';

        return this.postService.post(postBody, postUrl);
    }
}

