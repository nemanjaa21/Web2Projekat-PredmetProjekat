export class RegisterModel {
  constructor(
    Id,
    Comment,
    Address,
    Price,
    OrderTime,
    DeliveryTime,
    Status,
    OrderProducts,
    DeliveryPrice,
    User,
    UserId
  ) {
    this.Id = Id;
    this.Comment = Comment;
    this.Address = Address;
    this.Price = Price;
    this.OrderTime = OrderTime;
    this.DeliveryTime = DeliveryTime;
    this.Status = Status;
    this.OrderProducts = OrderProducts;
    this.DeliveryPrice = DeliveryPrice;
    this.User = User;
    this.UserId = UserId;
  }
}
