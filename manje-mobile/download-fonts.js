const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, 'assets', 'fonts');

// Create fonts directory if it doesn't exist
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const fontsToDownload = [
  {
    name: 'Comfortaa-Bold.ttf',
    url: 'https://raw.githubusercontent.com/googlefonts/comfortaa/main/fonts/TTF/Comfortaa-Bold.ttf'
  },
  {
    name: 'Comfortaa-Medium.ttf',
    url: 'https://raw.githubusercontent.com/googlefonts/comfortaa/main/fonts/TTF/Comfortaa-Medium.ttf'
  },
  {
    name: 'Inter-Regular.ttf',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/static/Inter-Regular.ttf'
  },
  {
    name: 'Inter-Medium.ttf',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/static/Inter-Medium.ttf'
  },
  {
    name: 'Inter-SemiBold.ttf',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/static/Inter-SemiBold.ttf'
  },
  {
    name: 'Inter-Bold.ttf',
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/static/Inter-Bold.ttf'
  }
];

function downloadFont(font) {
  const destPath = path.join(fontsDir, font.name);
  console.log(`Downloading ${font.name} from ${font.url}...`);
  
  const request = https.get(font.url, (response) => {
    if (response.statusCode === 200) {
      const file = fs.createWriteStream(destPath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Successfully downloaded ${font.name}`);
      });
    } else {
      console.error(`Failed to download ${font.name}. Status Code: ${response.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${font.name}: ${err.message}`);
  });
}

fontsToDownload.forEach(downloadFont);
