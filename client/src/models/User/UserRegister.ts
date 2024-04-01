import User from "./User";

export default interface UserRegister extends User {
  passwordConfirm: string;
}