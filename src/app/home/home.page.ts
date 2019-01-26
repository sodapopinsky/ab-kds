import { Component } from '@angular/core';
import { Order } from 'ab-shared/models';
import * as moment from 'moment-timezone';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  orders: Order[] = [
    {
      id: '1',
      name: 'Test 1',
      createdAt: moment().format(),
      items: []
    }
  ];
}
