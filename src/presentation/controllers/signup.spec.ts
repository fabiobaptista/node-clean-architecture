import { InvalidParamError, MissingParamError, ServerError } from '../erros'
import { EmailValidator } from '../protocols'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  return {
    sut: new SignUpController(emailValidatorStub),
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    // System under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@any.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    // System under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', () => {
    // System under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        email: 'any@any.com',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no password confirmation is provided', () => {
    // System under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any',
        email: 'any@any.com',
        password: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should return 400 if an invalid email is provided', () => {
    // System under test
    const { sut, emailValidatorStub } = makeSut()

    // change isValid return to false
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any@any.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', () => {
    // System under test
    const { sut, emailValidatorStub } = makeSut()

    // change isValid return to false
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const email = 'any@any.com'
    const httpRequest = {
      body: {
        name: 'any',
        email,
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith(email)
  })

  test('should return 500 if EmailValidation throws', () => {
    // System under test
    const { sut, emailValidatorStub } = makeSut()

    // change isValid return to false
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => { throw new Error() })

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any@any.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 400 if PasswordConfirmation fails', () => {
    // System under test
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any',
        email: 'any@any.com',
        password: 'any',
        passwordConfirmation: 'invalid_any'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })
})
