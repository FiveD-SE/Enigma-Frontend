import axios from "axios";
import { Buffer } from "buffer";
import { REACT_APP_STABILITY_API_KEY } from "../env";

export const genImageFromPrompt = async (prompt) => {
    const stabilityApiKey = REACT_APP_STABILITY_API_KEY;
    const formData = {
        prompt: prompt,
        output_format: "png",
    };

    const response = await axios.postForm(
        `https://api.stability.ai/v2beta/stable-image/generate/core`,
        axios.toFormData(formData, new FormData()),
        {
            validateStatus: undefined,
            responseType: "arraybuffer",
            headers: {
                Authorization: `Bearer ${stabilityApiKey}`,
                Accept: "image/*",
            },
        }
    );

    if (response.status === 200) {
        console.log("Generate image successfull");
    } else {
        throw new Error(`${response.status}: ${response.data.toString()}`);
    }
    const base64String = Buffer.from(response.data).toString("base64");
    const imageUrl = `data:image/png;base64,${base64String}`;
    return imageUrl;
};

export const genImageFromPromptAndImage = async (prompt, image) => {
    const stabilityApiKey = REACT_APP_STABILITY_API_KEY;
    const formData = {
        prompt: prompt,
        image: image,
    };

    const response = await axios.postForm(
        `https://api.stability.ai/v2beta/stable-image/control/sketch`,
        axios.toFormData(formData, new FormData()),
        {
            validateStatus: undefined,
            responseType: "arraybuffer",
            headers: {
                authorization: `Bearer ${stabilityApiKey}`,
                accept: "image/*",
            },
        }
    );

    if (response.status === 200) {
        console.log("Generate image successfull");
    } else {
        throw new Error(`${response.status}: ${response.data.toString()}`);
    }
    const base64String = Buffer.from(response.data).toString("base64");
    const imageUrl = `data:image/png;base64,${base64String}`;
    return imageUrl;
};
