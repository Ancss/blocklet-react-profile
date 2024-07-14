module.exports = {
  __esModule: true,
  default: jest.fn(() => ({
    connectApi: {
      open: jest.fn(),
    },
    connectHolder: jest.fn(),
  })),
};