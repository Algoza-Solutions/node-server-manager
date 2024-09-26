const { isFileExist } = require("../file");
const fs = require("fs");

jest.mock("fs", () => ({
  promises: {
    access: jest.fn(),
  },
}));

test("isFileExist returns true when file exists", async () => {
  fs.promises.access.mockResolvedValue();
  const result = await isFileExist("existingFile.js");
  expect(result).toBe(true);
});

test("isFileExist returns false when file does not exist", async () => {
  fs.promises.access.mockRejectedValue({ code: "ENOENT" });
  const result = await isFileExist("nonexistentFile.js");
  expect(result).toBe(false);
});
