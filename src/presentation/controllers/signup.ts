import { MissingParamError } from '../erros'
import { badRequest } from '../helpers'
import { HttpRequest, HttpResponse } from '../protocols'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
