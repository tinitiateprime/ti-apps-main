const express = require('express');
const fs = require('fs');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/data', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const minSectionsPerPage = parseInt(req.query.minSectionsPerPage) || 3;

    fs.readFile('data1.md', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading Markdown file');
        }

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



app.get('/content', (req, res) => {
const markdownFilePath = path.join(__dirname, 'config.md');

// Read the Markdown file
fs.readFile(markdownFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the Markdown file:', err);
        return;
    }

    // Parse the Markdown content into JSON
    const json = parseMarkdownToJSON(data);

    // Convert the JSON object to a string
    const jsonString = JSON.stringify(json, null, 2);

    // Write the JSON string to a new file
    const jsonFilePath = path.join(__dirname, 'config.json');
    fs.writeFile(jsonFilePath, jsonString, 'utf8', (err) => {
        if (err) {
            console.error('Error writing the JSON file:', err);
            return;
        }
        console.log('JSON file created successfully:', jsonFilePath);
    });
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
app.get('/index.js', (req, res) => {
    res.sendFile(path.join(__dirname,'ti-app-interview-qna', 'index.js'));    
  });
  app.get('/data1.md', (req, res) => {
    res.sendFile(path.join(__dirname,'ti-app-interview-qna', 'data.md'));    
  });
  
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'ti-app-interview-qna', 'index1.html'));
  });
  app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname,'ti-app-interview-qna', 'index.html'));
  });
  app.get('/config.md', (req, res) => {
    res.sendFile(path.join(__dirname,'ti-app-interview-qna', 'config.md'));
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
