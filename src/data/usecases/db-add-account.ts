import { AccountModel, AddAccount, AddAccountModel, Encrypter, AddAccountRepo } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepo: AddAccountRepo

  constructor (encrypter: Encrypter, addAccountRepo: AddAccountRepo) {
    this.encrypter = encrypter
    this.addAccountRepo = addAccountRepo
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    await this.addAccountRepo.add({
      ...account,
      password: hashedPassword
    })
    return await new Promise(resolve => resolve(null))
  }
}
