import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';
import { Person } from './person.service';

export interface Voucher {
  id: BigInt;
  code: string;
  discountPercentage: number;
  voucherUser: Person;
}
@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  constructor(private postService: PostService) { }


  getVoucherByCode(code: string): Observable<Voucher> {
    const postBody = {code: code};
    const postUrl = 'api/getvoucherbycode';
    
    return this.postService.post(postBody, postUrl);
  }
}
