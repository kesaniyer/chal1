const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 3000;

const flag = "Pctf{L!qU1d_H3L1um_";
const LOG_PATH = "C:\\Windows\\Log\\systemRestore"; 

app.use(express.json());
app.use(express.static(path.join(__dirname, 'includes'))); 

const payload = {
  endpoint: "/logs",
  examplePayload: {
    Path: "C:\\Windows\\Log\\systemRestore"
  },
};

const token = jwt.sign(payload, 'LePctf', {
  algorithm: 'HS256',
  header: {
    typ: 'JWT'
  }
});

const recursiveMerge = (target, source) => {
    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key]) target[key] = {};
            recursiveMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
};

app.post("/leConfig", (req, res) => {
  res.cookie('token', token, {
    httpOnly: false,     // ✅ Critical: blocks JS access
    secure: false,      // Set to `true` in production (requires HTTPS)
    sameSite: 'Strict', // ✅ Prevents CSRF
    maxAge: 3600000     // 1 hour
  });
  res.end();
})

app.post('/logs', (req, res) => {
    let sessionUser = {
        "Path": "C:\\Windows\\Log\\systemRestore" 
    };

    Object.preventExtensions(sessionUser);

    let userInput = req.body;
    recursiveMerge(sessionUser, userInput);
    if (sessionUser["Path"] === LOG_PATH) {
        if (sessionUser.isAdmin) {
            res.set('Content-Type', 'application/json');
            return res.send(JSON.stringify({
                message: `${flag}`
            }, null, 2));
        } else {
            res.set('Content-Type', 'application/json');
            return res.status(403).send(JSON.stringify({
                message: `Failed to access ${LOG_PATH}.`
            }, null, 2));
        }
    }
    
    res.status(404).json({ message: "Path invalid." });
});

app.get('/robots.txt', (req, res) => {
  const robotsPath = path.join(__dirname, 'includes', 'robots.txt');
  res.sendFile(robotsPath, (err) => {
    if (err) {
      res.status(404).send('Not found');
    }
  });
});

app.listen(PORT, () => {
    console.log(`Server OC Chal running on http://localhost:${PORT}`);
});
