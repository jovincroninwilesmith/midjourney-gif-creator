# Midjourney GIF Generator

This code takes any Midjourney prompt from your account and looks for all that runs with that specific prompt, fetches the results, and then it builds a GIF.

## Getting Started
This repository requires Node v16.14.0 so please make sure that this is installed on your computer.


### Step 1 - Install Node Modules
```
npm install
```

### Step 2 - Adding your Cookie to your .env
First, lets get a cookie from [Midjourney](https://www.midjourney.com/app/). This is done by logginng into your Midjourney account, Opening the development console,  looking for any request that issues a Fetch/XHR request to Midjourney, specifically `https://www.midjourney.com/api/app`. 

From there you will click on any of those requests, in the headers tab scroll down and copy the entire Cookie Header String.

Then, copy the `.env.sample` file and rename is `.env`. Now open up the `.env` file and copy in the entire Cookiew Header String into the file and save it.

### Step 3 - Running a command
This is the exciting part. Use this command: `npm run create-gif -- --prompt {INSERT_PROMPT} ` to pass in a prompt from your Midjourney adventures. 

