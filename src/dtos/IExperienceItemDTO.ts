export interface IExperienceItemDTO {
  title: string;
  keywords: Array<string>;
  company: string;
  currently?: boolean;
  period?: string;
  description: string;
  startsAt: Date;
  endsAt?: Date;
}
