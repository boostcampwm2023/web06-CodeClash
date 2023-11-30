export interface ProblemType {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
  memoryLimit: number;
  sampleCode: string;
  testcases: Testcase[];
}

interface Testcase {
  input: string;
  output: string;
}
