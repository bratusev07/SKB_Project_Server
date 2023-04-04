const nodeMail = require('nodemailer');
const json2xls = require('json2xls');
const fs = require('fs');
const userModel = require('../models/user-model');
const XLSX = require('xlsx');

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

    async sendXLSFile2(users) {
        const workbook = XLSX.utils.book_new();

        users.forEach((item, index) => {
            let date = ["Дата"];
            let startTime = ["Вход"];
            let endTime = ["Выход"];
            let resTime = ["Время"];
            try {
                for (var i = 1; i <= item.visits.length; i++) {
                    date[i] = item.visits[i].date;
                    startTime[i] = item.visits[i].startTime;
                    endTime[i] = item.visits[i].endTime;
                    resTime[i] = getTimeDiff(startTime[i], endTime[i]);
                }
            } catch (e) {}

            const worksheet = XLSX.utils.aoa_to_sheet(
                rotateMatrix([resTime, endTime, startTime, date])
            );

            XLSX.utils.book_append_sheet(workbook, worksheet, item.userName + " " + item.userLastName);
        });

        const fileName = 'data.xlsx';
        XLSX.writeFile(workbook, fileName);
    }
}

function getTimeDiff(time1, time2) {
    var t1 = new Date();
    var parts = time1.split(":");
    t1.setHours(parts[0], parts[1], 0, 0);

    var t2 = new Date();
    parts = time2.split(":");
    t2.setHours(parts[0], parts[1], 0, 0);

    var diff = t2.getTime() - t1.getTime();
    var res = diff / 60000;
    const hourString = Math.floor(res / 60).toString().padStart(2, '0');
    const minuteString = (res % 60).toString().padStart(2, '0');
    return `${hourString}:${minuteString}`;
}

function rotateMatrix(matrix) {
    var result = [];
    for (var i = 0; i < matrix[0].length; i++) {
        var row = [];
        for (var j = matrix.length - 1; j >= 0; j--) {
            row.push(matrix[j][i]);
        }
        result.push(row);
    }
    return result;
}

module.exports = new MailService();