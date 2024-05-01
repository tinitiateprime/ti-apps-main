const http = require('http');
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const cheerio = require('cheerio');
const PDFDocument = require('pdfkit');
const TurndownService = require('turndown');
const markdownpdf = require('markdown-pdf');

const turndownService = new TurndownService({headingStyle: 'atx',
codeBlockStyle: 'fenced',
hr: '---',
bulletListMarker: '*',
emDelimiter: '*',
strongDelimiter: '**',
linkStyle: 'inlined',
linkReferenceStyle: 'full'
});

// let text = `<table>
// <thead>
// <tr>
// <th>Feature</th>
// <th>AWS S3</th>
// <th>AWS EBS</th>
// </tr>
// </thead>
// <tbody>
// <tr>
// <td>Paradigm</td>
// <td>Object Store</td>
// <td>Filesystem</td>
// </tr>
// <tr>
// <td>Performance</td>
// <td>Fast</td>
// <td>Superfast</td>
// </tr>
// <tr>
// <td>Redundancy</td>
// <td>Across data centers</td>
// <td>Within a data center</td>
// </tr>
// <tr>
// <td>Security</td>
// <td>Using public or private key</td>
// <td>Can be used only with EC2</td>
// </tr>
// </tbody>
// </table>`
// const markdown = turndownService.turndown(text);
//         console.log(markdown);


const credentials = new AWS.SharedIniFileCredentials({ profile: 'tiappsadmin' });
AWS.config.credentials = credentials;

// Set the AWS region
AWS.config.update({ region: 'us-east-1' });

// Create an S3 instance
const s3 = new AWS.S3();

const app = express();

const doc = new PDFDocument();


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

 
app.get('/ti-apps-resume-builder/index.html', (req, res) => {
    res.sendFile(path.join(__dirname,'ti-apps-resume-builder', 'index.html'));
    
});

app.get('/ti-apps-resume-builder/style.css', (req, res) => {
    res.sendFile(path.join(__dirname,'ti-apps-resume-builder', 'style.css'));
});

app.get('/ti-apps-resume-builder/scripts/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-resume-builder','scripts', 'index.js'));    
});
app.get('/ti-apps-resume-builder/home.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-resume-builder','views', 'home.html'));    
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
    fs.writeFileSync(path.join(__dirname,'ti-apps-resume-builder','markdown-driver.json'), JSON.stringify(structure, null, 2), (writeErr) => {
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
app.get('/ti-apps-resume-builder/jsondata', (req, res) => {
   readDirectory(directoryPath);

  //const mdFiles = fileList.filter(file => path.extname(file) === '.md');
  fs.readFile(path.join(__dirname,'ti-apps-resume-builder','markdown-driver.json'), 'utf8', (err, content) => {
    if (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Error reading file');
        return;
    }
    filePath.push(JSON.parse(content))
    res.json(filePath);
});
});



app.get('/ti-apps-resume-builder/mdcontent', (req, res) => {
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


app.post('/ti-apps-resume-builder/save', (req, res) => {
  
  const jsonData = req.body;
  //console.log(jsonData)
  let markdownContent = '';

  jsonData.forEach(section => {
      markdownContent += `# ${section.header}\n`;
      section.items.forEach(item => {
          markdownContent += `* ${item}\n`;
      });
  });

  fs.writeFileSync(path.join(__dirname,'ti-apps-resume-builder','Output', 'output.md'), markdownContent);

  res.send('Data saved successfully');
});

app.post('/ti-apps-resume-builder/draft', (req, res) => {
  
  const jsonData = req.body;
  //console.log(jsonData)
  
  fs.writeFileSync(path.join(__dirname,'ti-apps-resume-builder','Drafts', 'draft.json'), JSON.stringify(jsonData, null, 2));

  res.send('Data saved in draft');
});

app.get('/ti-apps-resume-builder/load-draft', (req, res) => {
  if (fs.existsSync(path.join(__dirname,'ti-apps-resume-builder','Drafts', 'draft.json'))) {
      const jsonData = fs.readFileSync(path.join(__dirname,'ti-apps-resume-builder','Drafts', 'draft.json'), 'utf8');
      res.json(JSON.parse(jsonData));
  } else {
      res.json([]);
  }
});

//MCQ SECTION 

app.get('/ti-apps-mcq-quiz1/scripts/index.js', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-apps-mcq-quiz1', 'scripts', 'index.js'));    
});
app.get('/ti-apps-mcq-quiz1/scripts/quiz.js', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-apps-mcq-quiz1', 'scripts', 'quiz.js'));    
});
app.get('/ti-apps-mcq-quiz1/scripts/quiz_multiple.js', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-apps-mcq-quiz1', 'scripts', 'quiz_multiple.js'));    
});
app.get('/ti-apps-mcq-quiz1/index.html', (req, res) => {
  res.sendFile(path.join(__dirname,'ti-apps-mcq-quiz1','index.html'));    
});

app.get('/ti-apps-mcq-quiz1/scripts/random.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-mcq-quiz1','scripts', 'random.js'));    
});

app.get('/ti-apps-mcq-quiz1/scripts/random_multiple.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-mcq-quiz1','scripts', 'random_multiple.js'));    
});


app.get('/ti-apps-mcq-quiz1/quiz.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-mcq-quiz1','views', 'quiz.html'));    
});

app.get('/ti-apps-mcq-quiz1/quiz.md', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-mcq-quiz1','quiz.md'));    
});

app.get('/ti-apps-mcq-quiz1/quiz_multiple.md', (req, res) => {
  res.sendFile(path.join(__dirname, 'ti-apps-mcq-quiz1','quiz_multiple.md'));    
});


app.get('/ti-apps-mcq-quiz1/quiz.json', (req, res) => {
  const mdPath = path.join(__dirname,'ti-apps-mcq-quiz1','JSONs', 'quiz.json');
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

app.get('/ti-apps-mcq-quiz1/execute' , ()=>{
  require('./ti-apps-mcq-quiz1/scripts/quiz.js');
  require('./ti-apps-mcq-quiz1/scripts/random.js');
});

app.get('/ti-apps-mcq-quiz1/execute_multiple' , ()=>{
  //console.log('inside execute')
require('./ti-apps-mcq-quiz1/scripts/quiz_multiple.js');
require('./ti-apps-mcq-quiz1/scripts/random_multiple.js');
});

app.get('/ti-apps-mcq-quiz1/random', (req, res) => {
  //console.log('random.json')
  const mdPath = path.join(__dirname,'ti-apps-mcq-quiz1','JSONs', 'random.json');
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

app.get('/ti-apps-mcq-quiz1/quiz.md', (req, res) => {
 const mdPath = (path.join(__dirname,'ti-apps-mcq-quiz1','quiz.md'));   
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

app.get('/ti-apps-mcq-quiz1/quiz_multiple.md', (req, res) => {
 const mdPath = (path.join(__dirname,'ti-apps-mcq-quiz1','quiz_multiple.md'));   
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

app.post('/ti-apps-mcq-quiz1/submit', (req, res) => {
    
  const jsonData = req.body;
  //console.log(jsonData)
//  console.log(jsonData)

  fs.writeFileSync(path.join(__dirname,'ti-apps-mcq-quiz1','JSONs', 'result.json'), JSON.stringify(jsonData, null, 2));

  res.send('Data saved successfully');
});

// interview qna code

  app.get('/ti-app-interview-qna/data', async (req, res) => {
  //console.log(req.query)
  const page = parseInt(req.query.page) || 1;
  const minSectionsPerPage = parseInt(req.query.minSectionsPerPage) || 5;
  const filename = req.query.file
  //console.log('inside qna fecth')
  const folderName = 'interview-qna/data/'
  const params = {
    Bucket: bucketName,
    Prefix: folderName
};

 await s3.getObject({ Bucket: bucketName, Key: folderName+filename },  (err, data) => {
      if (err) {
          return res.status(500).send('Error reading Markdown file');
      }
      //1console.log('inside qna read')
      //console.log(data)
       data = data.Body.toString('utf-8');
       let seg =''
      const sections = data.split('#').map(section => md.render('#' + section.trim().replace(/^/, 'Q ').substring(1))).filter(section => section.trim() !== '');
      const totalSections = sections.length;
      const totalHashes = data.split('#').length-1; 
      const totalPages = Math.ceil(sections.length / minSectionsPerPage);
      const pageSize = Math.ceil(sections.length / totalPages); // page ques adjust.....
      const paginatedSections = sections.slice((page - 1)*pageSize , page * pageSize);
      paginatedSections.forEach((segment,index)=>{
        //console.log(segment)
        seg+=`<div id="Content_${index}"><input type="checkbox" onchange="attachCheckboxes(this)"/>${segment}</div>`
       })
//      console.log(seg)


      res.json({
        totalPages,
          totalPages: totalPages,
          totalSections,
          currentPage: page,
          totalHashes,
          data: seg,
          filename
      });
  });
 
});

app.get('/ti-app-interview/listobj',  (req,res)=>{
  //console.log(req.query.page)
  
  const folderName = 'interview-qna/data/'+req.query.page
  const params = {
    Bucket: bucketName,
    Prefix: folderName
};

    s3.listObjectsV2(params, (err, data) => {
    if (err) {
        console.error('Error listing objects:', err);
        return;
    }
   //console.log('line 373')
    const mdFiles = data.Contents.filter(item => item.Key.endsWith('.md')).map(item => item.Key);
   
    // Return the file names in JSON format
    //console.log(JSON.stringify(mdFiles, null, 2));
    res.json({
      listobj:JSON.stringify(mdFiles)
    });
 
  })

})
 

app.get('/ti-app-interview-qna/content', (req, res) => {
  //console.log('inside the fetch of the contnts')

  const fileList = []
  const fileKey = 'interview-qna/data/';
  
  s3.listObjectsV2({ Bucket: bucketName, Prefix: fileKey }, (err, data) => {
    if (err) {
      console.log('Error:', err);
    } else {
      //console.log(data.Body.toString('utf-8'))

      console.log('line 399')
    
     const folders= data.Contents.map(item => {
      const parts = item.Key.split('/');
      if (parts.length >= 3) {
          return parts[2];
      }
      return null;
      });
      const uniqueFolderNames = Array.from(new Set(folders.filter(name => name)));

      //console.log(uniqueFolderNames)
  

    res.json(uniqueFolderNames);
    
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

  

// Route to generate and download PDF
app.post('/ti-app-interview-qna/generate-pdf', async (req,res)=>{
  //console.log(req.query)
    const text = req.body;
    //console.log(text[0].items)
    let pdfcontent = ''
    try{
        const markdown = turndownService.turndown(text[0].items);
        //console.log(markdown);
      const pdfFilePath = 'output.pdf'
        markdownpdf().from.string(markdown).to(pdfFilePath, () => {
          console.log(`PDF generated: ${pdfFilePath}`);
          //callback(null, outputFilePath);
      });
    
      // fs.readFile(pdfFilePath, (err, data) => {
      //   if (err) {
      //       console.error('Error reading PDF file:', err);
      //       res.writeHead(500, { 'Content-Type': 'text/plain' });
      //       res.end('Internal Server Error');
      //       return;
      //   }
        
      //   res.setHeader('Content-disposition', 'attachment; filename=' + pdfFilePath);
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.end(data);
    // });

    fs.writeFileSync(path.join(__dirname,'output.md'), markdown);
  
   // res.send('Data saved successfully');
    }
    catch (ex){
      console.log(ex)
    }
});

  
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
