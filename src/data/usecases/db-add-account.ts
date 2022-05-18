import { AccountModel, AddAccount, AddAccountModel, Encrypter, AddAccountRepo } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepo: AddAccountRepo

  constructor (encrypter: Encrypter, addAccountRepo: AddAccountRepo) {
    this.encrypter = encrypter
    this.addAccountRepo = addAccountRepo
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepo.add({
      ...accountData,
      password: hashedPassword
    })
    return await new Promise(resolve => resolve(account))
  }
}
