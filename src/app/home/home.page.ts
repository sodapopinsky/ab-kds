import { Component } from "@angular/core";
import { Order } from "ab-shared/models";
import * as moment from "moment-timezone";
import * as _ from "lodash";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  cursor: number;
  queue = {};
  loading = true;
  orders: Order[];
  constructor() {
    this.updateOrders();
    this.updateQueue();
    this.loading = false;
  }

  updateOrders() {
    this.orders = [
      {
        id: Math.random().toString(),
        name: "Test 1",
        createdAt: moment().format(),
        items: [
          { type: "burger", cheese: "american" },
          { type: "burger", cheese: "american" },
          { type: "burger", cheese: "swiss" },
          { type: "burger", cheese: "swiss" }
        ]
      },
      {
        id: Math.random().toString(),
        name: "Test 2",
        createdAt: moment().format(),
        items: [
          { type: "turkey", cheese: "american" },
          { type: "turkey", cheese: "american" }
        ]
      }
    ];
    this.updateGrill();
  }

  addItem() {
    this.orders.push({
      id: Math.random().toString(),
      name: "Test 3",
      createdAt: moment().format(),
      items: [
        { type: "burger", cheese: "american" },
        { type: "burger", cheese: "american" }
      ]
    });
    this.updateGrill();
  }
  getMain(index) {
    const type = this.queue[index].type;
    if (type === "burger") {
      return "ab-grill-burger";
    }
    if (type === "turkey") {
      return "ab-grill-turkey";
    }
  }
  getCheese(index) {
    return "ab-grill-american";
  }
  getModifier(index) {
    return "S";
  }

  updateGrill() {
    this.cursor = null;
    let lastPosition = 0;
    _.each(this.orders, (order, orderIndex) => {
      _.each(order.items, (item, itemIndex) => {
        if (item.position) {
          lastPosition = item.position;
          if (!this.cursor) {
            this.cursor = item.position;
          }
        } else {
          if (!item.bumped) {
            if (!this.cursor) {
              this.cursor = 1;
              lastPosition = 1;
              item.position = lastPosition;
              this.queue[item.position] = {
                orderId: order.id,
                orderIndex: orderIndex,
                itemIndex: itemIndex,
                type: item.type
              };
            } else {
              lastPosition++;
              if (lastPosition > 12 && this.cursor > 1) {
                lastPosition = 1;
              }
              if (lastPosition <= 12) {
                if (lastPosition !== this.cursor) {
                  item.position = lastPosition;
                  this.queue[item.position] = {
                    orderId: order.id,
                    orderIndex: orderIndex,
                    itemIndex: itemIndex,
                    type: item.type
                  };
                } else {
                  lastPosition--;
                }
              }
            }
          }
        }

        // else {
        //   if (!item.bumped) {
        //     lastPosition++;
        //     console.log(
        //       `1: Cusor: ${this.cursor}, Last Position: ${lastPosition}`
        //     );
        //     if (lastPosition > 12) {
        //       lastPosition = 1;
        //     }

        //     if (lastPosition !== firstPosition) {
        //       item.position = lastPosition;
        //       this.queue[item.position] = {
        //         orderId: order.id,
        //         orderIndex: orderIndex,
        //         itemIndex: itemIndex
        //       };
        //     } else {
        //       lastPosition--;
        //     }
        //   }
        //   if (firstPosition === 0) {
        //     firstPosition = 1;
        //   }
        // }
      });
    });
    console.log(
      `After: Cursor: ${this.cursor}, Last Position: ${lastPosition}`
    );
  }

  // queue item is removed when bumped
  // cursor is placed at first item in order array that has not been bumped
  // order is removed from order array when all items are bumped
  // items are only added to queue if they are after cursor item

  bumpItem(index) {
    if (this.queue[index]) {
      const orderIndex = _.findIndex(this.orders, {
        id: this.queue[index].orderId
      });
      const itemIndex = this.queue[index].itemIndex;
      const order = this.orders[orderIndex];
      const item = order.items[itemIndex];
      item.bumped = true;
      item.position = null;
      let allBumped = true;
      _.each(order.items, _item => {
        if (!_item.bumped) {
          allBumped = false;
        }
      });
      if (allBumped) {
        this.orders.splice(orderIndex, 1);
      }

      this.queue[index] = undefined;

      // console.log(order);
      // order.items[this.queue[index].itemIndex].bumped = true;
      // order.items[this.queue[index].itemIndex].position = null;
      // this.queue[index] = undefined;
      // this.updateGrill();
    }
    this.updateGrill();
  }

  updateQueue() {
    // // get first unbumped item in order queue
    // let orderIndex;
    // let itemIndex;
    // _.each(this.orders, (order, _orderIndex) => {
    //   _.each(order.items, (item, _itemIndex) => {
    //     if (!item.bumped) {
    //       orderIndex = _orderIndex;
    //       itemIndex = _itemIndex;
    //       return false;
    //     }
    //   });
    //   if (orderIndex) {
    //     return false;
    //   }
    // });
    // // search queue for queue position of first unbumped order, this will be cursor position
    // // If not found, leave at 1
    // let position = 1;
    // _.each(this.queue, (item, key) => {
    //   if ((item.orderIndex === orderIndex && item.itemIndex === itemIndex)) {
    //     position = key;
    //     return false;
    //   }
    // });
    // this.cursor = position;
    // _.each(this.orders, (order, _orderIndex) => {
    //   _.each(order.items, (item, _itemIndex) => {
    //     if (!item.bumped) {
    //       this.queue[position] = {
    //         type: item.type,
    //         cheese: item.cheese,
    //         orderIndex: _orderIndex,
    //         itemIndex: _itemIndex
    //       };
    //       position++;
    //     }
    //   });
    // });
    // this.queue = {
    //   1: { type: "burger", cheese: "american", orderIndex: 0, itemIndex: 0 },
    //   2: { type: "burger", cheese: "swiss", orderIndex: 0, itemIndex: 1 },
    //   3: { type: "burger", cheese: "american", orderIndex: 0, itemIndex: 0 },
    //   4: { type: "burger", cheese: "swiss", orderIndex: 0, itemIndex: 1 },
    //   5: { type: "burger", cheese: "swiss", orderIndex: 0, itemIndex: 1 },
    //   6: { type: "burger", cheese: "swiss", orderIndex: 0, itemIndex: 1 }
    // };
    // this.cursor = 1;
  }
  getImage(index) {
    if (this.queue[index]) {
      return "icon/favicon.png";
    }
    return null;
  }
}
