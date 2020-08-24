const express = require('express')
const connectDB = require('./config/db')
const app = express()



app.get('/', (req,res) => res.send('Hello world'))

//connect to database
connectDB()

//Init middleware -- body parser
app.use(express.json({extended: false}))

//user login
app.use('/api/auth', require('./routes/auth'))

//user registration
app.use('/api/users', require('./routes/users'))

//users profile
app.use('/api/profile', require('./routes/profile'))

const PORT = 3000 || process.env.PORT
app.listen(PORT, console.log(PORT))