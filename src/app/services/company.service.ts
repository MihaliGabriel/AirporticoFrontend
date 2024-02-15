import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';

export interface Company {
  id: BigInt;
  companyCode: string;
  companyName: string;
  phone: string;
  email: string;
}
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private postService: PostService) { }

  getAllCompanies(): Observable<Company[]> {
    // Define postBody and postUrl as per your backend requirements
    const postBody = {};
    const postUrl = 'api/companies'; // Replace with your actual endpoint
    
    return this.postService.post(postBody, postUrl);
  }

  getCompanies(page: number, size: number): Observable<any> {
    const url =`api/companies?page=${page}&size=${size}`;
    return this.postService.get(url);
  }

  createCompany(company: Company): Observable<Company> {
    const postUrl = 'api/admin/createcompany';
    return this.postService.post(company, postUrl);
  }

  updateCompany(company: Company): Observable<Company> {
    const postUrl = 'api/admin/updatecompany';
    const postBody = {id: company.id, companyCode: company.companyCode, companyName: company.companyName, phone: company.phone, email: company.email,};
    console.log(postBody + "updated company in service");
    return this.postService.post(postBody, postUrl);
  }
  
  deleteCompany(id: BigInt): Observable<Company[]> {
    const postBody = {id: id};
    const postUrl = 'api/admin/deletecompany';
    console.log(postBody);
    return this.postService.post(postBody, postUrl);
  }

  searchCompany(company: Company): Observable<Company[]> {
    console.log(company);
    const postUrl = 'api/admin/searchcompanies';
    return this.postService.post(company, postUrl);
  }
}
