import { AccountEntity, AccountProvider } from "../account.entity";
import { AccountsRepository } from "../repositories/accounts.repository";
import { Injectable } from "@nestjs/common";

interface InterfaceFindByTypeAndAccountIDProps {
  relations?: { user?: boolean };
  providerAccountID: string;
  type: AccountProvider;
}

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  public findByTypeAndAccountID(props: InterfaceFindByTypeAndAccountIDProps): Promise<AccountEntity | null> {
    return this.accountsRepository.findByTypeAndAccountID(props);
  }

  public create(providerAccountID: string, type: AccountProvider, userID: string): Promise<AccountEntity> {
    const account = this.accountsRepository.create({ providerAccountID, provider: type, userID });
    return this.accountsRepository.save(account);
  }
}
