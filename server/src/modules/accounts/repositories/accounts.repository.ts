import { AccountEntity, AccountProvider } from "../account.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

interface InterfaceFindByTypeAndAccountIDProps {
  relations?: { user?: boolean };
  providerAccountID: string;
  type: AccountProvider;
}

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountsRepository: Repository<AccountEntity>,
  ) {}

  public findByTypeAndAccountID(props: InterfaceFindByTypeAndAccountIDProps): Promise<AccountEntity | null> {
    const { providerAccountID, type, relations } = props;

    return this.accountsRepository.findOne({
      where: { provider: type, providerAccountID },
      relations,
    });
  }

  public create(props: Partial<AccountEntity>): AccountEntity {
    return this.accountsRepository.create(props);
  }

  public save(account: AccountEntity): Promise<AccountEntity> {
    return this.accountsRepository.save(account);
  }
}
