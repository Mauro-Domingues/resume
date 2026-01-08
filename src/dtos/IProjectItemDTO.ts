export interface IProjectItemDTO {
  title: string;
  keywords: Array<string>;
  description: string;
  banner?: string;
  link?: {
    ref: string;
    value: string;
  };
}
