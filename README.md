# Zoom Email Confirmation

A *very* simple selfhosted app to send email confirmations to clients of Zoom meetings.
Made for my mom, as a counsellor she schedules many meetings each day, and the complexity of sending emails to all her clients was frusterating.

### How to use

0. Clone this repo
1. Create a Zoom JWU App (Need help? Check [this out](https://marketplace.zoom.us/docs/guides/getting-started/app-types/create-jwt-app)).
    - **Requires a paid Zoom subscription!**
2. Add your details to config.js
3. Run `npm i` and then `node index.js` in the root dir
4. Enjoy (or at least try to)

### To do

- Look nicer
- Better error messages
- Refractor index.js
- Make meeting-info page better (I hate pug.js)
- Add login to change settings/default email

Disclaimer: REST API functions are built off [this repo](https://github.com/zoom/zoom-api-jwt.git).