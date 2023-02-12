const express = require('express')
const path = require('path')
const app = express()

const shrinkRay = require('shrink-ray-current')
app.use(shrinkRay())
// app.use('/static', express.static(path.join(__dirname, 'build', 'static'), { maxAge: 31536000 }))
app.use(express.static(path.join(__dirname, 'dist')))
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})
app.listen(process.env.SERVER_PORT||3000, async () => {
    console.log(`Server started on port ${process.env.SERVER_PORT||3000}`)
})