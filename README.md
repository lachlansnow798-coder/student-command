# Student Command

Student Command is a public, installable student planner for school, homework, tests, sport, clubs, tutoring, jobs, and personal projects.

It is designed as a private local-first web app: student data stays in the browser on that device unless the student chooses to export, copy, or host their own version.

## Features

- First-run school setup for any country, school week, and timetable cycle.
- Today command centre with must-do items.
- Strict Coach Mode with planned-vs-actual tracking.
- Automatic study blocks for tests and homework.
- Project time that can be reduced when school work is behind.
- Practice quizzes with answer text boxes and feedback.
- Free local AI chat on Mac through Ollama when Ollama and a model are installed.
- Import page for pasted school info or screenshot text, with review-before-accept proposals.
- Installable PWA for iPhone, Android, Mac, Windows, and Chromebook.
- Optional Mac app wrapper and iPhone Xcode project for personal builds.

## Public Web App Route

The fastest worldwide distribution route is the PWA.

Publish only these files and folders:

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `service-worker.js`
- `icons/`
- `assets/`
- `Student Command Mac.zip` if you want to offer the free local AI Mac download.

Do not publish unpacked local build artifacts like `Student Command.app` or `tmp/`.

## Install

Use the public install guide from the published Student Command site.

On iPhone: open the website in Safari, tap Share, then Add to Home Screen.

On Android, Windows, Mac, or Chromebook: open the website in Chrome or Edge and use the install button when shown.

## Local Mac App

Double-click `Student Command.app`.

For free AI chat on Mac:

```sh
ollama pull llama3.2
```

Or double-click `setup-free-ai.command` to open Ollama and pull the default model.

The Mac wrapper tries to open Ollama automatically if it is installed. If the public web app is opened from GitHub Pages, local Ollama may be blocked by browser/origin rules. Use the downloadable Mac app for the free local AI path.

If rebuilding locally, run:

```sh
./build-mac-app.sh
```

## AI Limits

Student Command does not ship a paid shared AI key. That would create cost, abuse, and privacy problems.

The free option is Ollama, which runs on the same computer as the app. iPhone and Android PWA installs cannot automatically use Ollama running on someone else's Mac. Mobile AI would require a hosted backend with usage limits, which is not free at public scale.

## iPhone Xcode Project

The iPhone Xcode project is at:

```txt
ios/StudentCommand/StudentCommand.xcodeproj
```

Use this for personal testing. Public App Store or TestFlight distribution requires Apple signing and usually an adult-owned Apple Developer Program account.

## Privacy

Do not publish real student names, school accounts, API keys, personal timetables, or screenshots containing private school information.

The public build starts blank and asks each student to set up their own school profile.
