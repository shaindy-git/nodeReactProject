const mongoose = require('mongoose')
const studentScehema = new mongoose.Schema({
    firstName:{
        type : String,
        required :true,
    },
    lastName:{
        type : String,
        required :true,
    },
    userName:{
        type:String,
        unique: true,
        required:true
    },
    numberID:{
        type : String,
        required :true,
    },
    dateOfBirth:{
        type:mongoose.Schema.Types.Date,
        required :true
    },
    phone:{
        type : String,
        required :true,
    },
    email:{
        type : String,
        required :true,
    },
    password:{
        type : String,
        required :true,
    },
    area: {
        type: String,
        enum:["Jerusalem - Talpiot", "Jerusalem - Beit Hakerem", "Jerusalem - Ramot",
            "Jerusalem - Pisgat Zeev", "Tel Aviv - Center", "Tel Aviv - Arlozorov", 
            "Tel Aviv - Dizengoff", "Tel Aviv - Balfour", "Petah Tikva - Center", 
            "Herzliya - Pituach", "Netivot", "Haifa - Bat Galim", "Haifa - Kiryot", "Safed - David Elazar", 
            "Tel Aviv - Kikar Hamedina", "Holon", "Beer Sheva", "Beit Shemesh - Ha'ir", "Bat Yam - Allenby", "Ramat Gan - Begin"],
        
    },
    //--------------------------------------------------------------
    myTeacher:{
        type:mongoose.Schema.ObjectId,
        ref:"Teacher"
    },
    lessonsRemaining:{
        type:Number,
        default:28
    },
    lessonsLearned:{
        type:Number,
        default:0
    },
    dateforLessonsAndTest:{
        type:[{date:{
            type:mongoose.Schema.Types.Date,
            required :true,
        },
        hour:{
            type:String,
            enum:["01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00",
                "13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00","24:00"],
            required :true,
        },
        typeOfHour:{
            type: String,
            enum: ['Lesson', 'Test'],
            required :true,

        }}]
    }
    
},{
    timestamps: true
})
module.exports = mongoose.model('Student', studentScehema )