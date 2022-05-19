import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  constructor() {}
  subject: WebSocketSubject<any> | undefined;

  public create(url: string) {
    this.subject = new WebSocketSubject(url);

    return this.subject;
  }
}
