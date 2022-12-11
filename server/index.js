const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 5000

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceId = process.env.TWILIO_SERVICE_ID
const twilioClient = require('twilio')(accountSid, authToken)



app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}))

app.use(express.json())
app.use(express.urlencoded())

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    next(); 
})

app.get('/', (req, res)=>{
    res.send('Server Online')
})
app.use('/auth', cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}), authRoutes)

app.post('/', (req, res)=>{
    const { message, user: sender, type, members } = req.body

    if(type === 'message.new'){
        members
            .filter((member)=> member.user_id != sender.id)
            .forEach(({user})=>{
                if(!user.online){
                    twilioClient.messages.create({
                        body : `You have a new message from ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid : 'MGd0a89a8d7ab64e51b2f59f67477e685d',
                        to: user.phoneNumber
                    }).then(()=>{
                        console.log('Message sent!')
                    }).catch((err)=>console.Console.log(err))
                }
            })
            res.status(200).send("Message sent!")
    }
    return res.status(200).send('Not a new message.')
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})