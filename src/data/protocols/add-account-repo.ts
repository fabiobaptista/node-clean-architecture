import { AccountModel, AddAccountModel } from '../usecases/db-add-account-protocols'

export interface AddAccountRepo {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
