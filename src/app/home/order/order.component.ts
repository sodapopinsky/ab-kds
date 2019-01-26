import { Component, OnInit, Input } from "@angular/core";
import { Order } from "ab-shared/models";
import * as moment from "moment-timezone";

@Component({
  selector: "ab-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"]
})
export class OrderComponent implements OnInit {
  @Input() order: Order;
  now: moment.Moment;
  constructor() {
    this.now = moment();
    setInterval(() => {
      this.now = moment();
    }, 1000);
  }

  duration(createdAt) {
    const diff = this.now.diff(moment(createdAt));
    const f = moment.utc(diff).format("mm:ss");
    return f;
  }

  ngOnInit() {}
}
