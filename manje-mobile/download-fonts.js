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
    name: 'Syne-Bold.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/syne/static/Syne-Bold.ttf'
  },
  {
    name: 'Syne-ExtraBold.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/syne/static/Syne-ExtraBold.ttf'
  },
  {
    name: 'WorkSans-Regular.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/worksans/static/WorkSans-Regular.ttf'
  },
  {
    name: 'WorkSans-Medium.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/worksans/static/WorkSans-Medium.ttf'
  },
  {
    name: 'WorkSans-SemiBold.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/worksans/static/WorkSans-SemiBold.ttf'
  },
  {
    name: 'WorkSans-Bold.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/worksans/static/WorkSans-Bold.ttf'
  }
];

function downloadFont(font) {
  const destPath = path.join(fontsDir, font.name);
  console.log(`Downloading ${font.name}...`);
  
  const request = https.get(font.url, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
      // Handle redirect
      https.get(response.headers.location, (res) => {
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Successfully downloaded ${font.name}`);
        });
      }).on('error', (err) => {
        console.error(`Error downloading redirected ${font.name}: ${err.message}`);
      });
    } else if (response.statusCode === 200) {
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
