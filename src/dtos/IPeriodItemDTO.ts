export interface IPeriodItemDTO {
  keywords: Array<string>;
  currently?: boolean;
  period?: string;
  startsAt: Date;
  endsAt?: Date;
}
