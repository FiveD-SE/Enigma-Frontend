const axios = require("axios");
const SERVER_URL = "https://enigma-dropshipping.up.railway.app";
const VIETQR_URL = "https://api.vietqr.io/v2/banks";

async function createPaymentLink(formValue) {
    try {
        console.log(SERVER_URL);
        const res = await axios({
            method: "POST",
            url: `${SERVER_URL}/create-payment-link`,
            data: formValue,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error creating payment link:", error);
        if (error.response) {
            return error.response.data;
        } else {
            return { error: "Network Error" };
        }
    }
}

async function getOrder(orderId) {
    try {
        const res = await axios({
            method: "GET",
            url: `${SERVER_URL}/order/${orderId}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        return error.response.data; // Return error data for handling
    }
}

async function getBanksList() {
    try {
        const res = await axios({
            method: "GET",
            url: VIETQR_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        return error.response.data; // Return error data for handling
    }
}

// Export the functions to make them available for use in other files
module.exports = {
    createPaymentLink,
    getOrder,
    getBanksList,
};
