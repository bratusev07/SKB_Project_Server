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

    async sendXLSFile2(users, startDate) {
        const workbook = XLSX.utils.book_new();

        users.forEach(item => {
            let date = ["Дата"];
            let startTime = ["Вход"];
            let endTime = ["Выход"];
            let j = 1;
            let resTime = ["Время"];
            try {
                for (var i = 0; i < item.visits.length; i++) {
                    if (compareDates(startDate, item.visits[i].date)) {
                        date[j] = item.visits[i].date;
                        startTime[j] = item.visits[i].startTime;
                        endTime[j] = item.visits[i].endTime;
                        resTime[j] = getTimeDiff(startTime[j], endTime[j]);
                        j++;
                    }
                }
            } catch (e) { }

            const worksheet = XLSX.utils.aoa_to_sheet(
                rotateMatrix([resTime, endTime, startTime, date])
            );

            XLSX.utils.book_append_sheet(workbook, worksheet, item.userName + " " + item.userLastName);
        });

        const fileName = '/tmp/data222.xlsx';
        XLSX.writeFile(workbook, fileName);
    }
}

function compareDates(dateStr1, dateStr2) {
    const [day1, month1, year1] = dateStr1.split(".");
    const [day2, month2, year2] = dateStr2.split(".");
    const date1 = new Date(year1, month1, day1);
    const date2 = new Date(year2, month2, day2);
    return date1.getTime() < date2.getTime();
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