const http = require('http');
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

const credentials = new AWS.SharedIniFileCredentials({ profile: 'tiappsadmin' });
AWS.config.credentials = credentials;

// Set the AWS region
AWS.config.update({ region: 'us-east-1' });

// Create an S3 instance
const s3 = new AWS.S3();

const app = express();



app.use(express.static('public'));
const bodyParser = require('body-parser');
const { CONNREFUSED } = require('dns');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'website/images')));



app.get('/menu.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'menu.html'));    
  });
app.get('/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.js'));    
  });
  

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));    
  });

 
app.get('/ti-apps-profile-manager/index.html', (req, res) => {
    res.sendFile(path.join(__dirname,'ti-apps-profile-manager', 'index.html'));
    
});

app.get('/ti-apps-profile-manager/style.css', (req, res) => {
    res.sendFile(path.join(__dirname,'ti-apps-profile-manager', 'style.css'));
});

app.get('/ti-apps-profile-manager/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-profile-manager','scripts', 'index.js'));    
});
app.get('/ti-apps-profile-manager/home.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-profile-manager','views', 'home.html'));    
});

const bucketName = 'ti-apps-data';
 function readDirectory(directoryPath){
  const keyPrefix = directoryPath
 s3.listObjectsV2({ Bucket: bucketName, Prefix: keyPrefix }, (err, data) => {
  if (err) {
    console.log('Error:', err);
  } else {
    // Function to build the hierarchical structure
    const buildStructure = (keys) => {
      const folders = [];
      const folderMap = {};
      keys.forEach(key => {
        const path=  keyPrefix
        const relativeKey = key.replace(keyPrefix, '');
        const parts = relativeKey.split('/');
        const fileName = parts.pop();
        const folderPath = parts.join('/') + '/';

        if (!folderMap[folderPath]) {
          const folderObject = {
            folder: folderPath,
            contents: [],
            path:path
          };
          folders.push(folderObject);
          folderMap[folderPath] = folderObject;
        }

        if (fileName) {
          folderMap[folderPath].contents.push(fileName);
        }
      });

      return folders;
    };

    const keys = data.Contents.map(object => object.Key);
    const structure = buildStructure(keys);

    
    // Save the output to a JSON file
    fs.writeFileSync(path.join(__dirname,'ti-apps-profile-manager','markdown-driver.json'), JSON.stringify(structure, null, 2), (writeErr) => {
      if (writeErr) {
        console.log('Error writing to file:', writeErr);
      } else {
        console.log(`Output saved to path`);
      }
    });
  }
});

}

const directoryPath = 'profile-master/data/';
const filePath = []
app.get('/ti-apps-profile-manager/jsondata', (req, res) => {
   readDirectory(directoryPath);

  //const mdFiles = fileList.filter(file => path.extname(file) === '.md');
  fs.readFile(path.join(__dirname,'ti-apps-profile-manager','markdown-driver.json'), 'utf8', (err, content) => {
    if (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Error reading file');
        return;
    }
    filePath.push(JSON.parse(content))
    res.json(filePath);
});
});



app.get('/ti-apps-profile-manager/mdcontent', (req, res) => {
 console.log(req.query.file)
  //const directoryPath = path.join(__dirname, req.query.file);
  const filePath = path.join(__dirname, req.query.file);
  const fileList = []
const fileKey = req.query.file;

s3.getObject({ Bucket: bucketName, Key: fileKey }, (err, data) => {
  if (err) {
    console.log('Error:', err);
  } else {
    // The file content is available in data.Body
    const fileContent = data.Body.toString('utf-8');
    //console.log(`Content of ${fileKey}:`);
    //console.log(fileContent);
    fileList.push(fileContent)
    res.json(fileList);
    
    
  }
});});


app.post('/ti-apps-profile-manager/save', (req, res) => {
  
  const jsonData = req.body;
  //console.log(jsonData)
  let markdownContent = '';

  jsonData.forEach(section => {
      markdownContent += `# ${section.header}\n`;
      section.items.forEach(item => {
          markdownContent += `* ${item}\n`;
      });
  });

  fs.writeFileSync(path.join(__dirname,'ti-apps-profile-manager','Output', 'output.md'), markdownContent);

  res.send('Data saved successfully');
});

app.post('/`ti-apps-profile-manager/draft', (req, res) => {
  
  const jsonData = req.body;
  //console.log(jsonData)
  
  fs.writeFileSync(path.join(__dirname,'ti-apps-profile-manager','Drafts', 'draft.json'), JSON.stringify(jsonData, null, 2));

  res.send('Data saved in draft');
});

app.get('/ti-apps-profile-manager/load-draft', (req, res) => {
  if (fs.existsSync(path.join(__dirname,'ti-apps-profile-manager','Drafts', 'draft.json'))) {
      const jsonData = fs.readFileSync(path.join(__dirname,'ti-apps-profile-manager','Drafts', 'draft.json'), 'utf8');
      res.json(JSON.parse(jsonData));
  } else {
      res.json([]);
  }
});

//MCQ SECTION 

app.get('/ti-apps-mcq-quiz/index.js', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-apps-mcq-quiz', 'scripts', 'index.js'));    
});
app.get('/ti-apps-mcq-quiz/quiz.js', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-apps-mcq-quiz', 'scripts', 'quiz.js'));    
});
app.get('/ti-apps-mcq-quiz/quiz_multiple.js', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-apps-mcq-quiz', 'scripts', 'quiz_multiple.js'));    
});
app.get('/ti-apps-mcq-quiz/index.html', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-apps-mcq-quiz','index.html'));    
});

app.get('/ti-apps-mcq-quiz/random.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-mcq-quiz','scripts', 'random.js'));    
});

app.get('/ti-apps-mcq-quiz/random_multiple.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-mcq-quiz','scripts', 'random_multiple.js'));    
});


app.get('/ti-apps-mcq-quiz/quiz.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-mcq-quiz','views', 'quiz.html'));    
});

app.get('/ti-apps-mcq-quiz/quiz.md', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-mcq-quiz','quiz.md'));    
});

app.get('/ti-apps-mcq-quiz/quiz_multiple.md', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-mcq-quiz','quiz_multiple.md'));    
});


app.get('/ti-apps-mcq-quiz/quiz.json', (req, res) => {
  const mdPath = path.join(__dirname,'ti-apps-mcq-quiz','JSONs', 'quiz.json');
    fs.readFile(mdPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/json' });
      res.end(data);
    }); 
});

app.get('/ti-apps-mcq-quiz/execute' , ()=>{
  require('./ti-apps-mcq-quiz/scripts/quiz.js');
  require('./ti-apps-mcq-quiz/scripts/random.js');
});

app.get('/ti-apps-mcq-quiz/execute_multiple' , ()=>{
  //console.log('inside execute')
require('./ti-apps-mcq-quiz/scripts/quiz_multiple.js');
require('./ti-apps-mcq-quiz/scripts/random_multiple.js');
});

app.get('/ti-apps-mcq-quiz/random', (req, res) => {
  //console.log('random.json')
  const mdPath = path.join(__dirname,'ti-apps-mcq-quiz','JSONs', 'random.json');
    fs.readFile(mdPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/json' });
      res.end(data);
    });;    
});

app.get('/ti-apps-mcq-quiz/quiz.md', (req, res) => {
 const mdPath = (path.join(__dirname,'ti-apps-mcq-quiz','quiz.md'));   
 fs.readFile(mdPath, (err, data) => {
  if (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/markdown' });
  res.end(data);
}); 
});

app.get('/ti-apps-mcq-quiz/quiz_multiple.md', (req, res) => {
 const mdPath = (path.join(__dirname,'ti-apps-mcq-quiz','quiz_multiple.md'));   
 fs.readFile(mdPath, (err, data) => {
  if (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/markdown' });
  res.end(data);
}); 
});

app.post('/ti-apps-mcq-quiz/submit', (req, res) => {
    
  const jsonData = req.body;
  //console.log(jsonData)
//  console.log(jsonData)

  fs.writeFileSync(path.join(__dirname,'ti-apps-mcq-quiz','JSONs', 'result.json'), JSON.stringify(jsonData, null, 2));

  res.send('Data saved successfully');
});

// interview qna code
app.get('/ti-app-interview-qna/data', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const minSectionsPerPage = parseInt(req.query.minSectionsPerPage) || 3;
  //console.log('inside qna fecth')
  //listMarkdownFiles('your-bucket-name', 'your-folder-name/');
  const mdPath = (path.join(__dirname,'ti-app-interview-qna','java','data1.md'));   
  fs.readFile(mdPath, 'utf-8',(err, data) => {
      if (err) {
          return res.status(500).send('Error reading Markdown file');
      }
      //1console.log('inside qna read')
      const sections = data.split('#').map(section => md.render('#' + section.trim().replace(/^/, 'Q ').substring(1))).filter(section => section.trim() !== '');
      const totalPages = Math.ceil(sections.length / minSectionsPerPage);
      const pageSize = Math.ceil(sections.length / totalPages); // page ques adjust.....
      const paginatedSections = sections.slice((page - 1) * pageSize, page * pageSize);

      res.json({
          totalPages: totalPages,
          currentPage: page,
          data: paginatedSections
      });
  });
});

app.get('/ti-app-interview-qna/content', (req, res) => {
  //console.log('inside the fetch of the contnts')

  const fileList = []
  const fileKey = 'interview-qna/aws-test/config.md';
  
  s3.getObject({ Bucket: bucketName, Key: fileKey }, (err, data) => {
    if (err) {
      console.log('Error:', err);
    } else {
      //console.log(data.Body.toString('utf-8'))
      const json = parseMarkdownToJSON(data.Body.toString('utf-8'));

    // Convert the JSON object to a string
    const jsonString = JSON.stringify(json, null, 2);

    // Write the JSON string to a new file
    res.json(JSON.parse(jsonString))
    //console.log(res)
    }
  });


/**
 * Parses the Markdown content into a JSON object.
 * @param {string} markdown The Markdown content.
 * @returns {object} The JSON object.
 */
function parseMarkdownToJSON(markdown) {
    const lines = markdown.split('\n');
    const json = {};
    let currentKey = '';

    lines.forEach(line => {
        if (line.startsWith('#')) {
            currentKey = line.substring(2).trim();
            json[currentKey] = [];
        } else if (line.startsWith('*')) {
            const value = line.substring(2).trim();
            if (currentKey) {
                json[currentKey].push(value);
            }
        }
    });

    return json;
}
  });

  function listMarkdownFiles(bucketName, folderName) {
    const params = {
        Bucket: bucketName,
        Prefix: folderName
    };
  
    s3.listObjectsV2(params, (err, data) => {
        if (err) {
            console.error('Error listing objects:', err);
            return;
        }
  
        // Filter for .md files
        const mdFiles = data.Contents.filter(item => item.Key.endsWith('.md')).map(item => item.Key);
  
        // Return the file names in JSON format
        console.log(JSON.stringify(mdFiles, null, 2));
    });
  }

  
app.get('/ti-app-interview-qna/index.js', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-app-interview-qna', 'index.js'));    
});
app.get('/ti-app-interview-qna/content.js', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-app-interview-qna', 'content.js'));    
});
app.get('/ti-app-interview-qna/java', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-app-interview-qna', 'java'));    
});
// app.get('/ti-app-interview-qna/data1.md', (req, res) => {
//   res.sendFile(path.join(__dirname,'ti-app-interview-qna','java', 'data.md'));    
// });
// app.get('/ti-app-interview-qna/data1.md', (req, res) => {
//   res.sendFile(path.join(__dirname,'ti-app-interview-qna','java', 'data2.md'));    
// });
// app.get('/ti-app-interview-qna/data1.md', (req, res) => {
//   res.sendFile(path.join(__dirname,'ti-app-interview-qna','java', 'data1.md'));    
// });

app.get('/ti-app-interview-qna/index1.html', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-app-interview-qna', 'index1.html'));
});


app.get('/ti-app-interview-qna/index.html', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-app-interview-qna', 'index.html'));
});

app.get('/ti-app-interview-qna/config.md', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-app-interview-qna', 'config.md'));
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/ti-apps-gen-ai/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-gen-ai','index.html'));    
});app.get('/ti-apps-gen-ai/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-gen-ai','index.html'));    
});
app.get('/ti-apps-gen-ai/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-gen-ai','index.js'));    
});

const PORT = process.env.PORT || 4400;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



// Example usage
