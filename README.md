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

Do not publish local build artifacts like `Student Command.app`, `tmp/`, or zip files.

## Install

Use the public install guide from the published Student Command site.

On iPhone: open the website in Safari, tap Share, then Add to Home Screen.

On Android, Windows, Mac, or Chromebook: open the website in Chrome or Edge and use the install button when shown.

## Local Mac App

Double-click `Student Command.app`.

If rebuilding locally, run:

```sh
./build-mac-app.sh
```

## iPhone Xcode Project

The iPhone Xcode project is at:

```txt
ios/StudentCommand/StudentCommand.xcodeproj
```

Use this for personal testing. Public App Store or TestFlight distribution requires Apple signing and usually an adult-owned Apple Developer Program account.

## Privacy

Do not publish real student names, school accounts, API keys, personal timetables, or screenshots containing private school information.

The public build starts blank and asks each student to set up their own school profile.
