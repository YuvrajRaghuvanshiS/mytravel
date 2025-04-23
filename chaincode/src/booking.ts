/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Object, Property } from "fabric-contract-api";

@Object()
export class Booking {
  @Property()
  public bookingID: string = "book_1745430810..._vxcx98...";

  @Property()
  public userID: string = "yuvrajRaghuvanshiS";

  @Property()
  public isUserAnonymous: boolean = true;

  @Property()
  public userName: string = "Yuvraj Raghuvanshi";

  @Property()
  public userEmail: string = "not.my.email@example.com";

  @Property()
  public travelID: string = "1";

  @Property()
  public seatNumbers: string = "1A,1B";

  @Property()
  public totalPrice: number = 100;

  @Property()
  public transactionID: string = "txn_1745430810..._e4sorr...";

  @Property()
  public status: string = "Confirmed";

  @Property()
  public createdAt: string = new Date().toISOString();

  @Property()
  public hyperledgerTxId: string =
    "8a0f66758c9ece3154d68fa173f9403de42ba6955f1e690e3de5df5f031c2...";
}
