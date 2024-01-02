export const TestcasesService = jest.fn().mockReturnValue({
  async getTestcases(problemId) {
    console.log(problemId);

    return [
      {
        id: 1,
        problem: { id: problemId },
        input: '1\n2',
        output: '3',
      },
    ];
  },

  async getAllTestcases() {
    return [
      {
        id: 1,
        problem: { id: 1 },
        input: '1\n2',
        output: '3',
      },
    ];
  },

  async createTestcase(createTestcaseDto) {
    return {
      id: 1,
      problem: { id: createTestcaseDto.problemId },
      input: createTestcaseDto.input,
      output: createTestcaseDto.output,
      isExample: createTestcaseDto.isExample,
    };
  },

  async updateTestcase(testcaseId, updateTestcaseDto) {
    return {
      id: testcaseId,
      ...updateTestcaseDto,
    };
  },

  async deleteTestcase(testcaseId) {
    return {
      id: testcaseId,
    };
  },
});
