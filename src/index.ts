import { createCanvas, loadImage } from 'canvas';
const GIFEncoder = require('gif-encoder-2');
import { createWriteStream, mkdirSync, rmSync, existsSync } from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';
const yargs = require('yargs/yargs')(process.argv.slice(2));
dotenv.config();

import { getMidjourneyApiData } from './lib/midjourney';

// Getting a Midjourney cookie
// Login to midjourney, open the dev console, go anywhere that issues a Fetch/XHR request to midjourney
// Click on any of those requests, in the headers tab scroll down and copy the entire cookie header string, paste it into .env file.
const CKIE = process.env.COOKIE as string;

// Use the --prompt flag to pass in the prompt that you want to use.
const argv = yargs.usage('Midjourney GIF Creator.').options({
  prompt: {
    description: 'Provide the prompt that you want to create a gif for.',
    required: true,
    alias: 'p'
  }
}).argv;

// This takes the prompt, stores it as a variable, and will be used to make are network request
const PROMPT = argv.prompt;

(async () => {
  // Define the GIF algorithm
  const algorithm = 'neuquant';

  // Define the directory path where the gif's will be stored.
  const imagesFolder = path.join(__dirname, 'images');

  // Create an images folder if it does not exist. If it does exist remove that directory and recreate it.
  if (existsSync(imagesFolder)) {
    rmSync(imagesFolder, { recursive: true });
  }
  mkdirSync(imagesFolder);

  // Get the data from the midjourney api based on the prompt.
  const response = await getMidjourneyApiData({
    amount: 50,
    prompt: PROMPT,
    cookie: CKIE
  });
  const { data } = response as any;

  // This sorts the results chronologically so that the gif has the oldest run first.
  const sortedResults = data.sort((a: any, b: any) => b.enqueue_time - a.enqueue_time);

  // This takes one result and users it as the base for the height and width of the gif.
  const singleResult = sortedResults[0];
  const image = await loadImage(singleResult['image_paths'][0]);
  const width = image.width;
  const height = image.height;

  // base GIF filepath on which algorithm is being used
  const dstPath = path.join(imagesFolder, `${PROMPT}.gif`);

  // create a write stream for GIF data
  const writeStream = createWriteStream(dstPath);

  // when stream closes GIF is created so resolve promise
  writeStream.on('close', () => {
    return;
  });

  // Create a new GIF encoder with
  const encoder = new GIFEncoder(width, height, algorithm);

  // pipe encoder's read stream to our write stream
  encoder.createReadStream().pipe(writeStream);
  encoder.start();
  encoder.setDelay(200);

  // Use the height and width you got from the image results.
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Iterate through all the results and add them to the GIF.
  for (const result of sortedResults) {
    for (const url of result.image_paths) {
      const image = await loadImage(url);
      ctx.drawImage(image, 0, 0, width, height);
      encoder.addFrame(ctx);
      image.src = path.join(imagesFolder, singleResult.id);
    }
  }
})();
