const Razorpay = require('razorpay');
var request = require('request');

let API_Key = 'rzp_test_KL0Y3IqsaaDdfN';
let SECRET_Key = 'wgi2dk6EHkaDBUYJupiepoNu';
let razorPay_URL = 'https://rzp_test_KL0Y3IqsaaDdfN:wgi2dk6EHkaDBUYJupiepoNu@api.razorpay.com/v1';
var instance = new Razorpay(
    {
        key_id: API_Key,
        key_secret: SECRET_Key
    });

const Create_Customer_On_RzrPay = function (user) {
    let apiURL = razorPay_URL + '/customers';
    console.log("-----------create customer----------", user)
    if (user) {

        var options = {
            name: user.name,
            contact: '+91' + String(user.contact),
            email: user.email,
            fail_existing: user.fail_existing,
            gstin: user.gstin,
            notes: {
                notes_key_1: "Tea, Earl Grey, Hot",
                notes_key_2: "Tea, Earl Grey… decaf."
            }
        };

        instance.customer.create(
            options,
            function (err, data) {
                if (err) { console.log("Customers error:", data); }
                console.log("Customers:", err)
            }
        );

    }

}

const Edit_Customer_On_RzrPay = function (customerId, customer) {

    if (customerId && customer) {
        instance.customer.edit(
            customerId,
            {
                name: customer.name,
                contact: '+91' + String(customer.mobile),
                email: customer.email,
                fail_existing: 0,
                gstin: "29XAbbA4369J1PA",
                notes: {
                    notes_key_1: "Tea, Earl Grey, Hot",
                    notes_key_2: "Tea, Earl Grey… decaf."
                }
            }
        );
    }

}

const Get_All_Customers_From_RzrPay = function () {
    instance.customers.all(options);
}

const Create_Order = function () {
    instance.orders.create({
        amount: 50000,
        currency: "INR",
        receipt: "receipt#1",
        notes: {
            key1: "value3",
            key2: "value2"
        }
    });
}

const Get_All_Orders = function () {
    instance.orders.all(option);
}

const Get_OrderByID = function (orderId) {
    instance.orders.fetch(orderId);
}

const Get_Payments_For_Order = function (orderId) {
    instance.orders.fetchPayments(orderId);
}

const Update_Order = function () {
    instance.orders.edit({
        "notes": {
            "key1": "value3",
            "key2": "value2"
        }
    });
}

const Capture_Payment = function (paymentId, amount, currency) {
    instance.payments.capture(paymentId, amount, currency);
}

const Get_PaymentBy_PayID = function (paymentId) {
    instance.payments.fetch(paymentId);
}

const Get_All_Payments = function () {
    instance.payments.all(option);
}

module.exports = {
    Get_All_Payments,
    Create_Customer_On_RzrPay,
    Edit_Customer_On_RzrPay,
    Get_All_Customers_From_RzrPay,
    Create_Order,
    Get_All_Orders,
    Get_OrderByID,
    Get_Payments_For_Order,
    Update_Order,
    Capture_Payment,
    Get_PaymentBy_PayID,
}
