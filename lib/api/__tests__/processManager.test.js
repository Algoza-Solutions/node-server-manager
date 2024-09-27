const fs = require("fs");
const path = require("path");
const os = require("os");
const { stopServer, checkServerStatus } = require("../processManager");

jest.mock("fs");

describe("Process Manager", () => {
  const pidDir = path.join(os.homedir(), ".nsm");
  const pidFile = path.join(pidDir, "pid");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("stopServer", () => {
    it("should stop the server if it is running", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue("12345");
      fs.unlinkSync.mockReturnValue();

      // Mock process.platform
      Object.defineProperty(process, "platform", {
        value: "linux",
      });

      // Mock process.kill
      const mockKill = jest.spyOn(process, "kill").mockImplementation(() => {});

      stopServer();

      expect(fs.existsSync).toHaveBeenCalledWith(pidFile);
      expect(fs.readFileSync).toHaveBeenCalledWith(pidFile, "utf8");
      expect(mockKill).toHaveBeenCalledWith(12345, "SIGTERM");
      expect(fs.unlinkSync).toHaveBeenCalledWith(pidFile);
      mockKill.mockRestore();
    });

    it("should log if server is not running", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue("12345");

      // Mock process.platform
      Object.defineProperty(process, "platform", {
        value: "linux",
      });

      // Mock process.kill to throw error
      const mockKill = jest.spyOn(process, "kill").mockImplementation(() => {
        throw new Error("Process not found");
      });

      console.error = jest.fn();

      stopServer();

      expect(fs.existsSync).toHaveBeenCalledWith(pidFile);
      expect(fs.readFileSync).toHaveBeenCalledWith(pidFile, "utf8");
      expect(mockKill).toHaveBeenCalledWith(12345, "SIGTERM");
      expect(console.error).toHaveBeenCalledWith(
        "Failed to stop server: Process not found",
      );
      mockKill.mockRestore();
    });

    it("should inform if PID file does not exist", () => {
      fs.existsSync.mockReturnValue(false);

      console.log = jest.fn();

      stopServer();

      expect(fs.existsSync).toHaveBeenCalledWith(pidFile);
      expect(console.log).toHaveBeenCalledWith(
        "No PID file found. Server is not running.",
      );
    });
  });

  describe("checkServerStatus", () => {
    it("should report server is running", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue("12345");

      // Mock isProcessRunning to return true
      const mockIsProcessRunning = jest
        .spyOn(require("../processManager"), "isProcessRunning")
        .mockReturnValue(true);

      console.log = jest.fn();

      checkServerStatus();

      expect(fs.existsSync).toHaveBeenCalledWith(pidFile);
      expect(fs.readFileSync).toHaveBeenCalledWith(pidFile, "utf8");
      expect(mockIsProcessRunning).toHaveBeenCalledWith(12345);
      expect(console.log).toHaveBeenCalledWith(
        "Server is running with PID 12345.",
      );
      mockIsProcessRunning.mockRestore();
    });

    it("should report server is not running and remove stale PID file", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue("12345");
      jest
        .spyOn(require("../processManager"), "isProcessRunning")
        .mockReturnValue(false);
      fs.unlinkSync.mockReturnValue();

      console.log = jest.fn();

      checkServerStatus();

      expect(fs.existsSync).toHaveBeenCalledWith(pidFile);
      expect(fs.readFileSync).toHaveBeenCalledWith(pidFile, "utf8");
      expect(console.log).toHaveBeenCalledWith("Server is not running.");
      expect(fs.unlinkSync).toHaveBeenCalledWith(pidFile);
    });

    it("should report server is not running if PID file does not exist", () => {
      fs.existsSync.mockReturnValue(false);

      console.log = jest.fn();

      checkServerStatus();

      expect(fs.existsSync).toHaveBeenCalledWith(pidFile);
      expect(console.log).toHaveBeenCalledWith("Server is not running.");
    });

    it("should handle invalid PID in PID file", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue("invalid-pid");

      console.error = jest.fn();

      checkServerStatus();

      expect(fs.existsSync).toHaveBeenCalledWith(pidFile);
      expect(fs.readFileSync).toHaveBeenCalledWith(pidFile, "utf8");
      expect(console.error).toHaveBeenCalledWith(
        "PID file contains invalid PID.",
      );
    });
  });
});
