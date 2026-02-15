# Project Eclipse

Project Eclipse is an informational website for our Y1 Integrated Project. It introduces Bongiku, shares character info, and provides simple login and account pages for a school project at Ngee Ann Polytechnic, Singapore.

The site focuses on a clean, friendly presentation of the project, with clear navigation and lightweight interactivity.

## Design Process

**Audience**: Students and lecturers viewing the project showcase, plus classmates who want a quick overview of the project and the team.

**Goals**:
- Explain what Bongiku is and why it exists.
- Highlight characters and the team behind the project.
- Provide a simple login/register experience for the demo.

**User Stories**:
- As a visitor, I want to understand the project in one page, so that I can decide whether to explore more.
- As a visitor, I want to view the characters, so that I can learn about the game world.
- As a user, I want to register or log in, so that I can access the account page.
- As a user, I want to see my account details, so that I can confirm my sign-in status.

**Wireframes / Mockups**:
- Figma (add the wireframes later)

## Features

### Existing Features
- Navigation bar - quick access to Home, Characters, and About pages.
- Hero section (Home) - highlights the project branding.
- Characters page - displays character visuals and details.
- About page - introduces Bongiku and the team.
- Login page - basic login flow tied to a hosted database.
- Register page - creates a new demo account.
- Account page - shows user info and lets users update profile data.
- Loading/animation overlays - improves feedback during login.

### Features Left to Implement
- Game download or playable demo embed.
- Team member role descriptions and bios.
- More account personalization options.

## Technologies Used

- HTML5 - page structure and semantic content.
- CSS3 - layout, branding, and responsive styling.
- JavaScript (ES6) - form handling, navigation updates, and dynamic UI.
- RESTdb.io - simple hosted storage for login/register demo.
- Lottie (dotlottie-wc) - animation overlay during login.
- Google Fonts (Quicksand) - typography.

## Assistive AI

This project used AI tools for development support and troubleshooting.


## Testing

Manual tests were performed for key user stories:

1. Login form:
	1. Open the Login page.
	2. Submit empty fields and verify the error message.
	3. Submit invalid credentials and verify the error message.
	4. Submit valid credentials and verify redirect to Home.

2. Register form:
	1. Open the Register page.
	2. Submit empty fields and verify the error message.
	3. Submit a taken username and verify the error message.
	4. Submit a new username and verify redirect to Login.

3. About page layout:
	1. Verify logo, subtitle, divider, and team cards are centered.
	2. Check layout on mobile widths.

**Browsers / Screen Sizes**:
- Tested on Chrome and Edge on Windows.
- Layout checked at mobile and desktop widths.

**Known Issues**:
- Add any bugs discovered during testing here.

## Credits

### Content
- Project text written by the team.

### Media
- All images are project assets created or provided by the team.

### Acknowledgements
- Ngee Ann Polytechnic for the project brief and guidance.


