export interface LabItem {
  id: string;
  title: string;
  summary: string;
  tech: string;
  href: string;
  external?: boolean;
}

/** 实验室 Demo 列表（静态页放 public/lab/<name>/） */
export const labItems: LabItem[] = [];
