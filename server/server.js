require("dotenv").config()
const express = require("express")
const cors = require("cors")

const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")
const { default: mongoose } = require("mongoose")

const PORT = process.env.PORT || 1050
const app = express()

connectDB()

app.use(cors(corsOptions))

app.use(express.json())

app.use("/auth", require("./routes/auth"))
app.use("/teacher", require("./routes/teacher"))
app.use("/manager", require("./routes/manager"))
app.use("/student", require("./routes/student"))
app.use("/admin",require("./routes/admin"))

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
mongoose.connection.on('error', err => {
    console.log(err)
})