export interface ProblemType {
  createdAt: string;
  description: string;
  id: number;
  memoryLimit: number;
  sampleCode: string;
  testcases: {
    id: number;
    input: string;
    output: string;
  };
  title: string;
  timeLimit: number;
  updatedAt: string;
}
