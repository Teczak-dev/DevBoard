export interface Project {
  id: number;
  title: string;
  status: "active" | "inactive";
  description?: string;
  snippets?: number[];
  tasks?: number[];
  markdown?: string;
}
