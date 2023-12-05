<br/>
<p align="center">
  <h3 align="center">Facebook Clone</h3>

  <p align="center">
    <a href="https://github.com/ken999999999999999/facebook-clone"><strong>Explore the docs »</strong></a>
    <br/>
    <br/>
    <a href="https://github.com/ken999999999999999/facebook-clone">View Demo</a>
    .
    <a href="https://github.com/ken999999999999999/facebook-clone/issues">Report Bug</a>
    .
    <a href="https://github.com/ken999999999999999/facebook-clone/issues">Request Feature</a>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/ken999999999999999/facebook-clone?color=dark-green) ![Forks](https://img.shields.io/github/forks/ken999999999999999/facebook-clone?style=social) ![Stargazers](https://img.shields.io/github/stars/ken999999999999999/facebook-clone?style=social) ![Issues](https://img.shields.io/github/issues/ken999999999999999/facebook-clone) 

## Table Of Contents

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Authors](#authors)

## About The Project

![alt text](https://github.com/ken999999999999999/facebook-clone/blob/main/screenshot.png?raw=true)

Introduction: https://docs.google.com/presentation/d/18l59u0hNWd3g6lJgNLsKxlMcukCjbKKA9eSortOCXck/edit?usp=sharing

### Prerequisites

Things you need to use the software and how to install them.

- Visual Studio Code
- `Dev Containers: ms-vscode-remote.remote-containers` extension in Visual Studio Code
- Docker Desktop
- Firebase Account

### How to run the project locally

1. Launch Docker Desktop

2. Go to Firebase projects page > Select your project > Click Project Settings > Click on the Service accounts tab > Generate new private key

3. Name the downloaded file 'serviceAccountKey.json' and put the file in backend directory

4. Clone / Fork the repo

```sh
git clone https://github.com/ken999999999999999/facebook-clone.git
```

5. Create .env files and copy it from the .env.template in root, frontend & backend directories

6. Replace the following with your app's Firebase project configuration in frontend/.env

```sh
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

7. Open frontend/backend directory in VS code > press F1 and select

```sh
> Dev Containers: Rebuild and Reopen in Container
```

8. Navigate `http://localhost:3000` in your browser

9. Enjoy!

See the [open issues](https://github.com/ken999999999999999/facebook-clone/issues) for a list of proposed features (and known issues).

## Authors

- **ken999999999999999** - ** - [ken999999999999999](https://github.com/ken999999999999999/) - **
- **leunglong0123** - ** - [leunglong0123](https://github.com/leunglong0123/) - **
