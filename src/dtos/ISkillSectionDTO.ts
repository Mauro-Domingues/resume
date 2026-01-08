import { ISkillItemDTO } from './ISkillItemDTO';

export interface ISkillSectionDTO {
  skills: Array<ISkillItemDTO>;
  keywords: Array<string>;
}
