import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.timeType || !data.date) {
                resolve({
                    data,
                    errCode: 1,
                    errMessage: 'Missing parameter '
                })
            }else{
                await emailService.sendSimpleEmail(data.email)
                //let token = uuidv4()

                // await emailService.sendSimpleEmail({
                //     reciverEmail: data.email,
                //     patientName: data.fullname,
                //     time: data.timeString,
                //     doctorName: data.doctorName,
                //     language: data.language,
                //     redirectLink: buildUrlEmail(data.doctorId, token)
                // })

                let user = await db.User.findOrCreate({
                    where: { email : data.email},
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    }
                })

                if(user && user[0]){
                    await db.Booking.findOrCreate({
                        where: {patientId: user[0].id},
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (error) {
            
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.token || !data.doctorId){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            }else{
                let appointment = await db.Booking.findOne({
                    where : {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if(appointment){
                    await appointment.save({
                        statusId: 'S2'
                    })
                    resolve({
                        errCode: 0,
                        errMessage: "Updated appointment successfully"
                    })
                }else{
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment has been activated or does not exist"
                    })
                }
            }
        } catch (error) {
            
        }
        resolve({
            errCode: 0,
            errMessage: 'ok'
        })
    })
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}