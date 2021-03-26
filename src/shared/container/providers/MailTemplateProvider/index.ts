import { container } from 'tsyringe';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProviders from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProviders';

const providers = {
  handlebars: HandlebarsMailTemplateProviders,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handlebars,
);
