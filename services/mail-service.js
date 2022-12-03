const nodeMail = require('nodemailer');
const toCsv = require('to-csv');
const UserModel = require("../models/user-model");

class MailService {

    constructor() {
        this.transporter = nodeMail.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
        })
    }

    async sendXLSFile(to) {
        //const data = UserModel.find
        const data = [
            {
                "_id": "61fd1dcb83f206effd39dd50",
                "gameId": "61fc58f611ae2f7d4a976009"
            }
        ]

        return [{filename: "subject" + '.csv',content: toCsv(data)}]

        await this.transporter.sendMail({
            from: process.env.SMTP_USER, to,
            subject: 'Отчёт о посещаемости',
            attachments: [{filename: "subject" + '.csv',content: toCsv(data)}]
        })
    }
}
module.exports = new MailService();