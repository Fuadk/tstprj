import { Injectable,OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import {    componentConfigDef } from '@modeldir/model';
//  https://codewithlogic.wordpress.com/2020/04/18/communication-among-nested-components-in-angular/
// TODO: Add Angular decorator.
@Injectable({
  providedIn: 'root'
})
export class StarNotifyService implements OnDestroy {

  constructor() { }




  private eventChannels = {};
  private subscriptions$: Subscription[] = [];

  public sendEvent<componentConfigDef>(eventName: string, data: componentConfigDef) {
    this.registerEvent<componentConfigDef>(eventName);
    (this.eventChannels[eventName] as Subject<componentConfigDef>).next(data);
  }

  public subscribeEvent<componentConfigDef>(eventName: string, cb: (data: componentConfigDef) => any): Subscription {
    this.registerEvent<componentConfigDef>(eventName);
    let subscribe = this.eventChannels[eventName].subscribe(cb);
    this.subscriptions$.push(subscribe);
    return subscribe;
  }

  ngOnDestroy() {
    // _.forEach(this.eventChannels, (name, subject) => subject.complete());
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }

  private registerEvent<componentConfigDef>(eventName: string) {
    if (!(eventName in this.eventChannels)) {
      this.eventChannels[eventName] = new Subject<componentConfigDef>();
    }
  }
}
