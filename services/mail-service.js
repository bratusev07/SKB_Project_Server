const nodeMail = require('nodemailer');
const json2xls = require('json2xls');
const fs = require('fs'); 
const userModel = require('../models/user-model');

class MailService {

    constructor() {
        this.transporter = nodeMail.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secureConnection: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                ciphers: 'SSLv3'
            }
        })
    }

    async sendXLSFile(data) {
        const xls = json2xls(data);
        fs.writeFileSync('data.xlsx', xls, 'binary'); 
    }
}

module.exports = new MailService();