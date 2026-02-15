<img width="1085" height="628" alt="image" src="https://github.com/bongo-Louis/projectEclipseWS/blob/main/img/game_logo.png?raw=true" />

# Project Eclipse

Our Wesbite is an informational website for our Y1 Integrated Project. It introduces Bongiku, shares character info, and provides simple login and account pages for a school project at Ngee Ann Polytechnic, Singapore. The website is made to introduce and promote our game, Project Eclipse. 

Project eclipse is a fan made visual novel game based on Pokemon Ultra Sun and Moon. It is an original story game, with well-known Pokemon from the Alola region. Despite being a visual novel game, we have incorporated a combat system, which is a mix of Dungeons and Dragon's dice rolling mechanic and also Pokemon. The story will have multiple endings depending on choices you make in the story, and also has achievements that you can unlock along the way, earning points to unlock side stories. 



## Design Process

For the design process of the website, I took inspiration from Zenless Zone Zero's official website for the main page and character page. The about me page is similar to the about me page for Team Cherry. The website is made for Pokemon fans or visual novel enjoyers to help promote and introduce our game, Project Eclipse. The website has a main page with art featuring 3 important characters in our stoory, with a black and white filter, to match the style of our game. The character page showcases the main characters of the game for people to find out more about, and also attract them to play the game if they like the characters. The website also serves as a short introduction to our game without spoiling too much of the story. The about me page introduces our group that made the game. 

As a user, I want to find out more about Project eclipse, so that I can decide on whether to play the game or not. 
As a user, I want to find out more about the characters in Project Eclipse, so that I can quickly gather information on the cast and learn about the world. 

Figma wireframe:https://www.figma.com/design/LtZ6yuLg7gxWPhmQ2aTmiO/IP_bongiku_website?node-id=13-5&t=Q5kifqhDgACh0R1s-1



## Features

### Existing Features
- Navigation bar - quick access to Home, Characters, and About pages.
- Home Page - highlights the project branding.
- Characters page - displays character visuals and details.
- About me page - introduces Bongiku and the team.
- Login page - basic login flow tied to a hosted database, manage save data.
- Register page - creates a new demo account.
- Account page - shows user info and lets users update profile data.
- Loading/animation overlays - improves feedback during login.


## Technologies Used

- HTML - page structure and semantic content.
- CSS - layout, branding, and responsive styling.
- JavaScript - form handling, navigation updates, and dynamic UI.
- RESTdb.io - simple hosted storage for login/register demo.
- Lottie - animation overlay during login.
- Google Fonts - typography.
- imgBB - Image CDN api that hosts account profile pictures

## Assistive AI

This project used AI tools for development support and troubleshooting.

Rest.DB and ImgBB
	- Github's Copilot chat was used to develop and troubleshoot the javascript code used between the 2 APIs for both account management, and profile picture uploads.
Misc Website coding
	- When not working, Github's Copilot chat was also used to troubleshoot the faulty code.

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
- Tested with Chrome Windows.
- Layout checked at mobile and desktop widths.


## Credits
Nintendo and Gamefreak for the Pokemon characters and official art. 
https://www.pokemon.com/us/pokemon-video-games/pokemon-ultra-sun-and-pokemon-ultra-moon

Layout from Zenless Zone Zero website
https://zenless.hoyoverse.com/en-us/main

### Content
- Project text written by the team.
  
### Media

Bulbapedia for the images of the characters used.
https://bulbapedia.bulbagarden.net/wiki/Main_Page

### Acknowledgements
- I recieved inspiration for this project from the Zenless Zone Zero, Honkai Star Rail and Genshin Impact's official websites, and used a layout similar to theirs. 


