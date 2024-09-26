# Node Server Manager (nsm)

## Overview

**Node Server Manager (nsm)** is a minimal utility designed to run a Node.js server as a daemon process. It simplifies the management of starting, stopping, and monitoring Node.js server processes from the command line.

## Features

- **Start** a Node.js script as a daemon process.
- **Stop** a running daemonized Node.js server.
- **Check status** of the daemonized server.
- Cross-platform compatibility (Windows, macOS, Linux).
- Logging of server output to a specified log file.
- PID file management for reliable process control.

## Repository

- **GitHub URL:** [https://github.com/Algoza-Solutions/node-server-manager.git](https://github.com/Algoza-Solutions/node-server-manager.git)

## Installation

### Prerequisites

- **Node.js** (version 12 or higher)
- **npm** (Node Package Manager)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Algoza-Solutions/node-server-manager.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd node-server-manager
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Install the `nsm` Binary**

   To use `nsm` from anywhere on your system, you need to install the `nsm` binary globally. There are a couple of ways to do this:

   #### Option 1: Install Globally via npm

   ```bash
   npm install -g
   ```

   This will install the `nsm` command globally, allowing you to use it from any directory.

   #### Option 2: Link the Binary Manually

   If you prefer not to install globally via npm, you can create a symbolic link to the `nsm` binary:

   ```bash
   # Assuming you are in the project root directory
   sudo ln -s "$(pwd)/bin/nsm" /usr/local/bin/nsm
   ```

   This command creates a symbolic link to the `nsm` executable in `/usr/local/bin`, which is typically in your system's PATH.

   **Note:** On Windows, you may need to adjust these commands accordingly or add the `bin` directory to your PATH environment variable.

## Usage

### Command-line Interface

The `nsm` utility uses a command-line interface with the following syntax:

```bash
nsm <command> [options]
```

### Commands

#### 1. `start`

Starts a Node.js script as a daemon process.

**Syntax:**

```bash
nsm start <scriptPath> [logFilePath]
```

**Parameters:**

- `<scriptPath>`: The path to the Node.js script to run.
- `[logFilePath]`: (Optional) The path to the log file. Defaults to `~/node.log`.

**Example:**

```bash
nsm start ./app.js ./logs/app.log
```

**Description:**

- Checks if the server is already running.
- Starts the server as a daemon process.
- Logs output to the specified log file.

#### 2. `stop`

Stops the running daemonized Node.js server.

**Syntax:**

```bash
nsm stop
```

**Example:**

```bash
nsm stop
```

**Description:**

- Reads the PID from the PID file.
- Stops the process corresponding to the PID.
- Removes the PID file after stopping the server.

#### 3. `status`

Checks if the daemonized server is running and displays its status.

**Syntax:**

```bash
nsm status
```

**Example:**

```bash
nsm status
```

**Description:**

- Checks if the PID file exists.
- Verifies if the process with the stored PID is running.
- Displays the server status and PID.

### Options

- `-h, --help`: Display help information.
- `-v, --version`: Display the current version of `nsm`.

## Configuration

No additional configuration is required. All settings can be specified through command-line arguments.

## Logging

- **Default Log File:** If no log file path is specified, logs are written to `~/node.log`.
- **Custom Log File:** Specify a custom log file path when starting the server.
- **Log Content:** Both `stdout` and `stderr` outputs from the Node.js server are logged.

## Examples

### Starting a Server

Start a server and log output to `~/logs/server.log`:

```bash
nsm start ./server.js ~/logs/server.log
```

### Stopping the Server

Stop the running server:

```bash
nsm stop
```

### Checking Server Status

Check if the server is running:

```bash
nsm status
```

## Function Reference

### `startServer`

Starts the Node.js server as a daemon process.

```javascript
/**
 * Starts the Node.js server as a daemon process.
 * @param {string} scriptPath - The path to the Node.js script to run.
 * @param {string} [logFilePath] - The path to the log file. Defaults to '~/node.log'.
 */
const startServer = (scriptPath, logFilePath) => {
  // Function implementation
};
```

### `stopServer`

Stops the running Node.js server daemon process.

```javascript
/**
 * Stops the running Node.js server daemon process.
 */
const stopServer = () => {
  // Function implementation
};
```

### `checkServerStatus`

Checks if the Node.js server daemon process is running.

```javascript
/**
 * Checks if the Node.js server daemon process is running.
 */
const checkServerStatus = () => {
  // Function implementation
};
```

## License

This project is licensed under the [GNU General Public License v2.0](LICENSE).

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

   Click on the "Fork" button at the top right corner of the repository page.

2. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**

   - Implement your feature or bug fix.
   - Write tests if applicable.
   - Ensure code follows the project's coding style.

4. **Commit Changes**

   ```bash
   git commit -am 'Add new feature'
   ```

5. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Submit a Pull Request**

   - Go to your fork on GitHub.
   - Click on "New Pull Request" and follow the instructions.

## Acknowledgments

- Thanks to all contributors and users for their valuable feedback and suggestions.
- Special thanks to the Node.js community for their continuous support.

---

**Please review the updated README file. If there are any issues or if you need further adjustments, let me know so we can resolve them before proceeding.**
