import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter()

describe('EmailValidator', () => {
  test('should return false if validator return false', () => {
    const sut = makeSut()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email')
    expect(isValid).toBe(false)
  })

  test('should return true if validator return true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('email@email.com')
    expect(isValid).toBe(true)
  })
  test('should return true if validator return true', () => {
    const sut = makeSut()

    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const email = 'email@email.com'

    sut.isValid(email)

    expect(isEmailSpy).toHaveBeenLastCalledWith(email)
  })
})
