import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    // System under test
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        // name: 'any',
        email: 'any@any.com',
        password: 'any',
        passwordConfirmation: 'any'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
