export class TestcasesMockRepository {
  testcases = [];

  async find() {
    return this.testcases;
  }

  async save(testcase) {
    this.testcases.push(testcase);
    return testcase;
  }

  async update() {}
}
