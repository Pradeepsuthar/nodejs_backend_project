const PaymentService = require('../services/PaymentService');


PaymentController = {

    Create_Custer_on_RzrPay: async (req, res) => {

        let customer = req.body;
        console.log("---------------Customer data------------:", req.body)
        if (!customer) {
            return res.send({ responseCode: 500, msg: 'Somthing want wrong! Please try again.' });
        }

        let customerData = await PaymentService.Create_Customer_On_RzrPay(customer);

        return res.send({ responseCode: 201, data: customerData, msg: 'Customer Created successfully!' });

    }

}

module.exports = PaymentController;