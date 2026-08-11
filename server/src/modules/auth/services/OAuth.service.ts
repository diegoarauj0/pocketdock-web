import { CryptoService } from "src/common/services/crypto.service";
import { OAuthEmailConflictException, OAuthEmailConflictReason } from "../exceptions/oAuthEmailConflict.exception";
import { InvalidOAuthStateException, InvalidOAuthStateReason } from "../exceptions/invalidOAuthState.exception";
import { AccountsService } from "src/modules/accounts/services/accounts.service";
import { AccountProvider } from "src/modules/accounts/account.entity";
import { UsersService } from "src/modules/users/services/users.service";
import { OAuthStrategyID } from "../strategies/base.strategy";
import { OAuthStrategyRegistry } from "../oAuthStrategy.registry";
import { UserEntity } from "src/modules/users/user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OAuthService {
  private readonly oAuthStrategyIDToAccountTypeMap: Record<OAuthStrategyID, AccountProvider> = {
    [OAuthStrategyID.GOOGLE]: AccountProvider.GOOGLE,
  };

  constructor(
    private readonly cryptoService: CryptoService,
    private readonly oAuthStrategyRegistry: OAuthStrategyRegistry,
    private readonly accountsService: AccountsService,
    private readonly usersService: UsersService,
  ) {}

  public async callback(OAuthStrategyID: OAuthStrategyID, code: string): Promise<UserEntity> {
    const { username, ID, email } = await this.oAuthStrategyRegistry.strategies[OAuthStrategyID].callback(code);

    const type = this.oAuthStrategyIDToAccountTypeMap[OAuthStrategyID];

    const existingAccount = await this.accountsService.findByTypeAndAccountID({
      relations: { user: true },
      providerAccountID: ID,
      type: type,
    });

    if (existingAccount !== null) {
      return existingAccount.user;
    }

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser !== null) {
      if (existingUser.emailVerified === false) {
        throw new OAuthEmailConflictException(OAuthEmailConflictReason.EXISTING_ACCOUNT_EMAIL_NOT_VERIFIED);
      }

      await this.accountsService.create(ID, type, existingUser.ID);

      return existingUser;
    }

    const user = await this.usersService.create(email, username);
    await this.usersService.verifyEmailByID(user.ID);

    await this.accountsService.create(ID, type, user.ID);

    return user;
  }

  public createAuthorizeURL(OAuthStrategyID: OAuthStrategyID): { authorizeURL: string; state: string } {
    const state = this.cryptoService.createRandomHash();

    const authorizeURL = this.oAuthStrategyRegistry.strategies[OAuthStrategyID].createAuthorizeURL(state);

    return { authorizeURL, state };
  }

  public validateState(state: string, stateCookie: string | undefined): void {
    if (!stateCookie) {
      throw new InvalidOAuthStateException(InvalidOAuthStateReason.MISSING_STATE_COOKIE);
    }

    if (this.cryptoService.timingSafeEqual(state, stateCookie) === false) {
      throw new InvalidOAuthStateException(InvalidOAuthStateReason.STATE_MISMATCH);
    }
  }
}
