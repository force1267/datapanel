const fs = require('fs')
const path = require('path')
require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('trust proxy', 1)
const sessionKeys = process.env.sessionKeys.split(',');
app.use(cookieSession({
	name: 'session',
	keys: sessionKeys
}))

const db = require("./db.json");
if(!db.users) {
    db.users = []
}
//
save();
var saveLock = false;
function save() {
    if(saveLock) return
    saveLock = true
    fs.writeFile("db.json", JSON.stringify(db), e => saveLock = false)
}


// login and register
app.get("/login", (req, res) => {
    var { username, password } = req.query;
    for(var u of db.users) {
        if(u.username === username) {
            if(u.password === password) {
                req.user = u;
                req.session.userid = u.id;
                return res.json("ok");
            } else {
                return res.status(403).json("wrong password");
            }
        }
    }
    var user;
    const id = db.users.push(user = { username, password, level: 1 }) - 1;
    user.id = id;
    setTimeout(e => {
        if(user.level < 3) { // not active
            db.user[id] = null;
        }
    }, 1000 * 60 * 5)
    return res.json({ id });
})

// auth every req from session
app.use((req, res, next) => {
    const sid = req.session.userid
    if(sid !== undefined) {
        req.user = db.users[sid];
    }
    return next();
})

const confirmCode = process.env.confirmCode;
app.get("/confirm" , private(1), (req, res) => {
    var { code } = req.query;
    if(code === confirmCode) {
        const lvl = db.users[id].level;
        db.users[id].level = lvl < 3 ? 3 : lvl
        save();
        return res.json("ok");
    } else {
        return res.status(403).json("premission denied")
    }
})


app.use(express.static(path.join(__dirname, '/ui/public')));

app.use(req => req.res.status(404).json("404"))

app.listen(80)
console.log("app running on http://localhost:80")


function private(level = 3) {
    return (req, res, next) => {
        if(req.user && req.user.level >= level) {
            return next();
        } else {
            return res.status(403).json("premission denied");
        }
    }
}