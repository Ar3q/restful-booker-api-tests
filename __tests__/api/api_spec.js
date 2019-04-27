/* eslint-disable no-unused-vars */
const frisby = require('frisby')
const Joi = frisby.Joi

const url = 'https://restful-booker.herokuapp.com'
const bookingUrl = url + '/booking'

//Auth token to access to PUT and DELETE
let authToken

//It's needed to create a auth token to access to PUT and DELETE
beforeAll(() => {
    return frisby
        .post(url + '/auth', {
            username: 'admin',
            password: 'password123'
        })
        .expect('status', 200)
        .then((res) => {
            authToken = 'token=' + res.json.token
            // eslint-disable-next-line no-console
            console.log('Token: ' + authToken)
        })
})

describe('GETs for booking', () => {
    describe('GetBookingIds: should return an array with objects and each of them should contains unique id of', () => {
        it('all bookings', () => {
            return frisby
                .get(bookingUrl)
                .expect('status', 200)
                .expect('jsonTypesStrict', '*', {
                    bookingid: Joi.number().required()
                })
        })
        // it('bookings with specifing firstname', () => {
        //     const firstNameParam = '?firstname=Sally'
        //     return frisby
        //         .get(bookingUrl + firstNameParam)
        //         .expect('status', 200)
        //         .expect('jsonTypes', '*', {
        //             bookingid: Joi.number()
        //         })
        // })
        // it('bookings with specifing lastname', () => {
        //     const lastNameParam = '?lastname=Brown'
        //     return frisby
        //         .get(bookingUrl + lastNameParam)
        //         .expect('status', 200)
        //         .expect('jsonTypes', '*', {
        //             bookingid: Joi.number()
        //         })
        // })
    })

    describe('GetBooking:', () => {
        it('should return a booking based upon the booking id provided', () => {
            const id = '/5';
            return frisby.get(bookingUrl + id)
                .expect('status', 200)
                .expect('jsonTypesStrict', {
                    firstname: Joi.string().required(),
                    lastname: Joi.string().required(),
                    totalprice: Joi.number().required(),
                    depositpaid: Joi.boolean().required(),
                    bookingdates: {
                        checkin: Joi.date().iso(),
                        checkout: Joi.date().iso()
                    },
                    additionalneeds: Joi.string()
                })
        })
    })
})

describe('POST CreateBooking:', () => {
    it('should return status 200 and created object', () => {
        return frisby.post(bookingUrl, {
            firstname: 'Mariusz',
            lastname: 'Pudzianowski',
            totalprice: 123,
            depositpaid: true,
            bookingdates: {
                checkin: "2019-04-27",
                checkout: "2019-05-01"
            },
            additionalneeds: 'Breakfast'
        })
            .expect('status', 200)
            .expect('json', 'booking', {
                firstname: 'Mariusz',
                lastname: 'Pudzianowski',
                totalprice: 123,
                depositpaid: true,
                bookingdates: {
                    checkin: "2019-04-27",
                    checkout: "2019-05-01"
                },
                additionalneeds: 'Breakfast'
            })
            .expect('jsonTypesStrict', {
                bookingid: Joi.number().required(),
                booking: {
                    firstname: Joi.string().required(),
                    lastname: Joi.string().required(),
                    totalprice: Joi.number().required(),
                    depositpaid: Joi.boolean().required(),
                    bookingdates: {
                        checkin: Joi.date().iso().required(),
                        checkout: Joi.date().iso().required()
                    },
                    additionalneeds: Joi.string().required()
                }
            })
    })
})

describe('PUT UpdateBooking:', () => {
    it('should return object with updated properites', () => {
        const urlWihIdParam = bookingUrl + '/1'
        return frisby.fetch(urlWihIdParam, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': authToken,
            },
            method: 'PATCH',
            body: JSON.stringify({
                firstname: 'Mariusz',
                lastname: 'Pudzianowski',
                totalprice: 123,
                depositpaid: true,
                bookingdates: {
                    checkin: "2019-04-27",
                    checkout: "2019-05-01"
                },
                additionalneeds: 'Breakfast'
            })
        })
            .expect('status', 200)
            .expect('json', {
                firstname: 'Mariusz',
                lastname: 'Pudzianowski',
                totalprice: 123,
                depositpaid: true,
                bookingdates: {
                    checkin: "2019-04-27",
                    checkout: "2019-05-01"
                },
                additionalneeds: 'Breakfast'
            })
            .expect('jsonTypesStrict', {
                firstname: Joi.string().required(),
                lastname: Joi.string().required(),
                totalprice: Joi.number().required(),
                depositpaid: Joi.boolean().required(),
                bookingdates: {
                    checkin: Joi.date().iso().required(),
                    checkout: Joi.date().iso().required()
                },
                additionalneeds: Joi.string().required()
            })
    })
})


describe('PATCH PartialUpdateBooking:', () => {
    it('should return object with updated and not updated properites', () => {
        const urlWihIdParam = bookingUrl + '/1'
        return frisby.fetch(urlWihIdParam, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': authToken,
            },
            method: 'PATCH',
            body: JSON.stringify({
                firstname: 'Józef',
                totalprice: 150,
                bookingdates: {
                    checkin: "2019-04-27",
                    checkout: "2019-05-02"
                }
            })
        })  
            .expect('status', 200)
            .expect('json', {
                firstname: 'Józef',
                lastname: 'Pudzianowski',
                totalprice: 150,
                depositpaid: true,
                bookingdates: {
                    checkout: "2019-05-02"
                },
                additionalneeds: 'Breakfast'
            })
            .expect('jsonTypesStrict', {
                firstname: Joi.string().required(),
                lastname: Joi.string().required(),
                totalprice: Joi.number().required(),
                depositpaid: Joi.boolean().required(),
                bookingdates: {
                    checkin: Joi.date().iso().required(),
                    checkout: Joi.date().iso().required()
                },
                additionalneeds: Joi.string().required()
            })
    })
})
