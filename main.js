const express = require('express')
const fs = require('fs')

const app = express()
app.use(express.static('public'));
app.listen(4000)

app.get('/', (req, res) => {
	data = fs.readFileSync('index.html', 'utf8')
	res.send(data)
})

app.get('/data.json', (req, res) => {
	data = fs.readFileSync('data.json', 'utf8')
	res.send(data)
})

