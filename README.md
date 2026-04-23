# Desktop Manager

Desktop Manager is a desktop application built with Electron and React that allows you to organize, search, and launch your local applications within customized workspaces. It features a frameless, Ubuntu-inspired user interface designed for productivity and clean aesthetics.

## Features

- Custom Workspaces: Group your applications into distinct environments (e.g., Development, Gaming, Design).
- Quick Launch: Execute local files, scripts, and applications directly from the interface.
- System Integration: Automatically extracts and uses native application icons and executable target paths.
- Global Search: Filter through your workspaces and added applications in real-time.
- Custom Window UI: Frameless window design with a custom top navigation bar, drag regions, and dynamic theming.
- Local Storage: Saves your workspace configurations and preferences locally using the file system.

## Tech Stack

- Core: Electron
- Frontend: React 18, Vite
- Styling: Tailwind CSS
- UI Components: Lucide React

## Getting Started

### Prerequisites

Ensure you have Node.js and npm installed on your system.

### Installation

1. Clone the repository:

```bash
git clone [https://github.com/yourusername/desktop-manager.git](https://github.com/yourusername/desktop-manager.git)
cd desktop-manager
```

### Install dependencies:

Bash
npm install
Development
To run the application in development mode with hot-reloading:

Bash
npm run electron:dev
This command starts the Vite development server and launches the Electron application simultaneously.

### Building for Production

To compile the application and create a standalone Windows executable (.exe):

Bash
npm run electron:build

The compiled installer and unpacked application files will be generated in the release directory. Note: Administrative privileges may be required to run the build script depending on your local system restrictions.

Then go to the release folder and execute the .exe

### Project Structure

/src: Contains the React frontend code, including UI components and styling.

/electron: Contains the main process code, handling window creation, native dialogs, and IPC communication.

/build: Contains application assets used exclusively during the packaging process (e.g., the Windows .ico file).

/dist: Generated automatically during the build process, containing the compiled frontend code.

Configuration
If you need to modify the default window size, background colors, or frame behavior, adjust the BrowserWindow configuration inside electron/main.js.

License
This project is open-source and available under the MIT License.
