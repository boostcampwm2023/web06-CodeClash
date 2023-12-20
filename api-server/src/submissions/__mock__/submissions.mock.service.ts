export const SubmissionsMockService = jest.fn().mockReturnValue({
  paginateSubmissionsByUserId: jest.fn(() => {
    return [];
  }),
  getCountOfSubmissionsByUserId: jest.fn(() => {
    return 0;
  }),
});
