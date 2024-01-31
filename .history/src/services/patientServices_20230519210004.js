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
            if(!data.email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter '
                })
            }else{
                let user = await db.User.findOrCreate({
                    where: { email : data.email},
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    }
                })

                // if(user && user[0]){
                //     await db.Booking.findOrCreate({
                //         where: {patientId: user[0].id},
                //         defaults: {
                //             statusId: 'S1',
                //             doctorId: data.doctorId,
                //             patientId: user[0].id,
                //             date: data.date,
                //             timeType: data.timeType
                //         }
                //     })
                // }

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