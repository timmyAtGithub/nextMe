# Project Setup Guide

This guide explains how to set up and run the project locally. It outlines the prerequisites, installation steps, and how to run the app using Expo.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 16 or higher)
- **npm** (usually comes with Node.js) or **Yarn**
- **Expo CLI** (install it globally using `npm install -g expo-cli` or `yarn global add expo-cli`)
- **Git** (optional, but recommended for version control)

### 1. Install Dependencies

Navigate to the project directory and install the required dependencies using npm or Yarn:

```bash
npm install
```

### 2. Set Up Environment Variables

Create a apiConfig.js and add your URL like
```js
const apiConfig = {
    BASE_URL: 'YOUR_URL',
  };

  module.exports = apiConfig;
```

### 3. Run the App

Once the dependencies are installed, you can start the development server using Expo:

```bash
npm start
```

This will start the Metro Bundler and provide you with a QR code that you can scan using the Expo Go app on your mobile device. Alternatively, you can run the app on an emulator or simulator.
