import { Buffer } from "buffer";
import { REACT_APP_PHOTOROOM_API_KEY } from "../env";

export const removeBackground = async (photoUri) => {
    const photoroomApiKey = REACT_APP_PHOTOROOM_API_KEY;
    const formData = new FormData();
    formData.append("image_file", {
        uri: photoUri,
        name: "image.jpg",
        type: "image/jpeg",
    });

    try {
        const response = await fetch("https://sdk.photoroom.com/v1/segment", {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                "x-api-key": photoroomApiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const buffer = await response.arrayBuffer();
        const base64String = Buffer.from(buffer).toString("base64");
        const imageUrl = `data:image/png;base64,${base64String}`;
        return imageUrl;
    } catch (error) {
        console.log("Error:", error);
        throw error;
    }
};
