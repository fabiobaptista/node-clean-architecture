import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    // System under test
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any@any.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })

  test('should return 400 if no email is provided', () => {
    // System under test
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })
})
