import { HttpException, HttpStatus } from '@nestjs/common';

import { IArgs, TLocalizePath } from '@common/types';

export class ErrorBase {
  public notFound(key: TLocalizePath, args?: IArgs): HttpException {
    throw this.getException(key, HttpStatus.NOT_FOUND, args);
  }

  public deleted(key: TLocalizePath, args?: IArgs): HttpException {
    throw this.getException(key, HttpStatus.OK, args);
  }

  public alreadyExist(key: TLocalizePath, args?: IArgs): HttpException {
    throw this.getException(key, HttpStatus.BAD_REQUEST, args);
  }

  public requestConflict(): HttpException {
    throw this.getException('***', HttpStatus.CONFLICT);
  }

  public get accessError(): HttpException {
    return this.getException('***', HttpStatus.UNAUTHORIZED);
  }

  public get refreshError(): HttpException {
    return this.getException('***', 498);
  }

  public get userIncorrect(): HttpException {
    throw this.badRequest(`***`);
  }

  public get errorConfirmCode(): HttpException {
    throw this.badRequest('***');
  }

  public invalidSendEmail(key: TLocalizePath, args?: IArgs): HttpException {
    throw this.getException(key, HttpStatus.BAD_REQUEST, args);
  }

  public badRequest(key: TLocalizePath, args?: IArgs): HttpException {
    throw this.getException(key, HttpStatus.BAD_REQUEST, args);
  }

  private getException(
    key: TLocalizePath,
    status: number,
    args?: IArgs,
  ): HttpException {
    throw new HttpException(
      {
        statusCode: status,
        message: key,
        args,
      },
      status,
    );
  }
}
