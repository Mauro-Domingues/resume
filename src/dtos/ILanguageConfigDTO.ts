import { ISkillItemDTO } from './ISkillItemDTO';

export interface ILanguageConfigDTO {
  html: { language: string; title: string };
  period: {
    format: string;
    untilNow: string;
  };
  headerTexts: { about: { title: string } };
  aboutTexts: { title: string };
  skillTexts: {
    title: string;
    options: Record<ISkillItemDTO['level'], string>;
  };
  targetTexts: { title: string };
  graduationTexts: {
    title: string;
    content: {
      title: string;
      period: string;
      description: string;
    };
  };
  specializationTexts: {
    title: string;
    content: {
      title: string;
      duration: string;
      time: string;
      description: string;
    };
  };
  projectTexts: { title: string };
  experienceTexts: {
    title: string;
    content: {
      title: string;
      period: string;
      description: string;
    };
  };
}
