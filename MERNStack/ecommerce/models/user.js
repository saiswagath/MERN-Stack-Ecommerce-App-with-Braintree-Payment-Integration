const mongoose = require('mongoose')
// node.js core module to hash password
const crypto = require('crypto')
// uuuid generation third party moudle
const { v1: uuidv1 } = require('uuid');


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        about: {
            type: String,
            trim: true
        },
        salt: String,
        // 0 for normal user 1 for admin
        role: {
            type: Number,
            default: 0
        },
        history: {
            type: Array,
            default: []
        }
    },
    //to automaticlly keep track of created at and updated at
    { timestamps: true }
);


// virtual field
userSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

//this is how we add method to mongoose schema
userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
        	//this is example in node.js crypto documentation
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    }
};

// we can 'User' model anywhere in controller etc to create update models etc..
module.exports = mongoose.model('User', userSchema);