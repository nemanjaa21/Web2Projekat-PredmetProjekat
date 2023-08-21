export class RegisterModel {
  constructor(
    Id,
    Email,
    Name,
    Price,
    Amount,
    Description,
    Image,
    OrderProducts,
    Deleted,
    User,
    UserId
  ) {
    this.Id = Id;
    this.Email = Email;
    this.Name = Name;
    this.Price = Price;
    this.Amount = Amount;
    this.Description = Description;
    this.Image = Image;
    this.OrderProducts = OrderProducts;
    this.Deleted = Deleted;
    this.Image = Image;
    this.User = User;
    this.UserId = UserId;
  }
}
