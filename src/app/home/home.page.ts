import { Component } from '@angular/core';
import { Order } from 'ab-shared/models';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  orders: Order;
  constructor(){
    
  }
  
}
