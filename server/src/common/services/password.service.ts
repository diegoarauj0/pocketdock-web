import { PASSWORD_CONSTANT } from "../password.constant";
import { Injectable } from "@nestjs/common";
import bcryptjs from "bcryptjs";

@Injectable()
export class PasswordService {
  public async hash(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(PASSWORD_CONSTANT.ROUND_SALT);
    return bcryptjs.hash(password, salt);
  }

  public compare(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }
}
