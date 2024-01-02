export const AuthService = jest.fn().mockReturnValue({
  async validateUser(username, pass) {
    if (username == 'test' && pass == 'test') {
      return {
        name: 'test',
        email: 'test@test.test',
        acceptCount: 0,
        failCount: 0,
        winCount: 0,
        totalCount: 0,
      };
    }

    return null;
  },

  async signToken(user, isRefreshToken) {
    return 'token';
  },

  async verifyToken(token) {
    return {
      name: 'test',
      email: 'test@test.test',
      acceptCount: 0,
      failCount: 0,
      winCount: 0,
      totalCount: 0,
    };
  },

  loginUser(user) {
    return {
      accessToken: 'token',
      refreshToken: 'token',
    };
  },
});
