import { DbAddAccount } from './db-add-account'
import { AccountModel, AddAccountModel, Encrypter, AddAccountRepo } from './db-add-account-protocols'

describe('DbAddAccount UseCase', () => {
  const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('hashed_password'))
      }
    }
    return new EncrypterStub()
  }

  const makeAddAccountRepo = (): AddAccountRepo => {
    class AddAccountRepoStub implements AddAccountRepo {
      async add (accountData: AddAccountModel): Promise<AccountModel> {
        const fakeAccount = {
          ...accountData,
          id: 'valid_id',
          password: 'hashed_password'
        }
        return await new Promise(resolve => resolve(fakeAccount))
      }
    }
    return new AddAccountRepoStub()
  }

  interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepoStub: AddAccountRepo
  }

  const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepoStub = makeAddAccountRepo()
    const sut = new DbAddAccount(encrypterStub, addAccountRepoStub)
    return {
      sut,
      encrypterStub,
      addAccountRepoStub
    }
  }

  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const password = 'valid_password'
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(password)
  })

  test('should throws if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockImplementationOnce(() => { throw new Error() })
    const password = 'valid_password'
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepoStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepoStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('should throws if AddAccountRepo throws', async () => {
    const { sut, addAccountRepoStub } = makeSut()
    jest.spyOn(addAccountRepoStub, 'add')
      .mockImplementationOnce(() => { throw new Error() })
    const password = 'valid_password'
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
