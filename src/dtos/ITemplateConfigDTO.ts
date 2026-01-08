import { IHEXColorDTO } from './IHEXColorDTO';

export interface ITemplateConfigDTO {
  name: 'default';
  language: 'enUs' | 'ptBr';
  monochrome: boolean;
  fontColor: IHEXColorDTO;
  fontSize: number;
}
