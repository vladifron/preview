import { I18nPath } from '@common/i18n/generated/i18n.generated';

export type TLocalizePath = I18nPath;

export interface IArgs {
  [key: string]: string | number | null;
}

export interface IExceptionInfo {
  message: TLocalizePath;
  args?: IArgs;
}
