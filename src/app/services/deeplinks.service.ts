// deep-link.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeepLinkService {
  private groupCodeSubject = new Subject<string>();
  
  groupCode$ = this.groupCodeSubject.asObservable();
  
  sendGroupCode(code: string) {
    this.groupCodeSubject.next(code);
  }
}