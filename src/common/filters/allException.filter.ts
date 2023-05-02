import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils/util';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import * as Joi from 'joi';
import {
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Catch,
} from '@nestjs/common';

import {
  I18nValidationException,
  I18nValidationError,
} from 'nestjs-i18n/dist/interfaces/i18n-validation-error.interface';
import {
  IExceptionInfo,
  TLocalizePath,
  IException,
  TSchema,
} from '@common/types';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(
    exception: I18nValidationException,
    host: ArgumentsHost,
  ): I18nValidationException {
    console.log(exception)
    const response = host.switchToHttp().getResponse();

    if (exception.message?.includes('Unexpected')) {
      this.send(response, <IException>exception.getResponse());

      return exception;
    }

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const lang = this.getLanguage(request);
    const exceptionInfo = this.getInfo(exception, lang);

    this.send(response, exceptionInfo);

    return exception;
  }

  private send(response: Response, exceptionInfo: IException): void {
    const { statusCode } = exceptionInfo;
    const { req } = response;

    this.loggingByExceptionInfo(req, exceptionInfo);

    response.status(statusCode).send(exceptionInfo);
  }

  private loggingByExceptionInfo(
    req: Request,
    exceptionInfo: IException,
  ): void {
  }

  private getInfo(exception: HttpException, lang: string): IException {
    if (exception instanceof I18nValidationException) {
      return this.getExceptionInfo(exception, lang);
    }

    if (exception instanceof HttpException) {
      return this.getExceptionInfo(exception, lang);
    }

    return this.getCriticalInfo(exception, lang);
  }

  getExceptionInfo(exception: HttpException, lang: string): IException {
    const message = this.getMessageByException(exception, lang);
    const statusCode = exception.getStatus();
    const error = this.getTitleErrorByCode(statusCode);

    return {
      statusCode,
      message,
      error,
    };
  }

  getCriticalInfo(exception: HttpException, lang: string): IException {
    const message = this.getMessageByException(exception, lang);
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const error = this.getTitleErrorByCode(statusCode);

    return {
      statusCode,
      message,
      error,
    };
  }

  private getMessageByException(
    exception: Error,
    lang: string,
  ): string | string[] {
    if (exception instanceof I18nValidationException) {
      return this.normalizeErrors(exception.errors, lang);
    }

    if (exception instanceof HttpException) {
      const { message, args } = <IExceptionInfo>exception.getResponse();

      return this.translate(<TLocalizePath>message, { args, lang });
    }

    return this.translate('validation.CRITICAL_ERROR', { lang });
  }

  private translate(key: TLocalizePath, options): string {
    return this.i18n.service.t(key, options);
  }

  private normalizeErrors(
    errors: I18nValidationError[] = [],
    lang: string,
  ): string[] {
    const translateErrors = formatI18nErrors(errors, this.i18n.service, {
      lang,
    });
    const allErrors = translateErrors.map(({ constraints }) =>
      Object.values(constraints),
    );

    return allErrors.flat();
  }

  private getLanguage(request: Request): string {
    const { language } = request.headers;
    const isValidLanguage = Joi.string()
      .valid('ru', 'en', 'debug')
      .validate(language);

    if (!isValidLanguage) return this.defaultLanguage;

    return <string>language;
  }

  private getTitleErrorByCode(code: number): string {
    const rawTitle = this.getRawTitleByCode(code);
    const addSpace = rawTitle.replace(/([A-Z])/g, ' $1');

    return addSpace.replace(/(\bException\b)/g, ' ').trim();
  }

  private getRawTitleByCode(status: number): string {
    if (status === HttpStatus.OK) return 'OkException';

    if (status === 498) return 'InvalidTokenException';

    const rawTitle = HttpErrorByCode[String(status)].name;

    return (
      rawTitle || HttpErrorByCode[String(HttpStatus.INTERNAL_SERVER_ERROR)].name
    );
  }

  get defaultLanguage(): string {
    return this.configService.get('***');
  }

  get configService(): ConfigService {
    return new ConfigService<TSchema>();
  }

  get i18n(): I18nContext {
    return I18nContext.current();
  }
}
