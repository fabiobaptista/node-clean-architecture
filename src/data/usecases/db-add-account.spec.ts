import { Encrypter } from '../protocols'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount UseCase', () => {
  interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
  }

  const makeSut = (): SutTypes => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('hashed_password'))
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    return {
      sut,
      encrypterStub
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
})
