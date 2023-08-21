export class RegisterModel {
  constructor(
    Id,
    Username,
    Email,
    Password,
    RepeatPassword,
    FirstName,
    LastName,
    Birthdate,
    Address,
    Image,
    Type
  ) {
    this.Id = Id;
    this.Username = Username;
    this.Email = Email;
    this.Password = Password;
    this.RepeatPassword = RepeatPassword;
    this.FirstName = FirstName;
    this.LastName = LastName;
    this.Birthdate = Birthdate;
    this.Address = Address;
    this.Image = Image;
    this.Type = Type;
  }
}
