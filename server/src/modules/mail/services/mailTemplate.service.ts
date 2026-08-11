import { Injectable } from "@nestjs/common";
import { promises as fs } from "node:fs";
import handlebars from "handlebars";
import path from "node:path";

export type TemplateMail = "verificationCodeEmail";

type TemplateDelegate = ReturnType<typeof handlebars.compile>;

@Injectable()
export class MailTemplateService {
  private readonly templatesPath = path.join(process.cwd(), "src", "modules", "mail", "templates");

  private readonly compiledTemplates = new Map<TemplateMail, TemplateDelegate>();

  public async render<T extends object>(template: TemplateMail, context: T): Promise<string> {
    const compiledTemplate = await this.getCompiledTemplate(template);

    return compiledTemplate(context);
  }

  private async getCompiledTemplate(template: TemplateMail): Promise<TemplateDelegate> {
    const cachedTemplate = this.compiledTemplates.get(template);

    if (cachedTemplate) return cachedTemplate;

    const templatePath = path.join(this.templatesPath, `${template}.template.hbs`);

    const source = await fs.readFile(templatePath, "utf8");

    const compiledTemplate = handlebars.compile(source);

    this.compiledTemplates.set(template, compiledTemplate);

    return compiledTemplate;
  }
}
