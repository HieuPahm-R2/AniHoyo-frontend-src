import axios from "axios";

export const callUploadImage = (file, folder) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder',folder);
    return axios({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
export const fetchFilmCategory = () => {
    return axios.get("/api/v1/get-all-category");
}
export const fetchFilmTags = () => {
    return axios.get("/api/v1/get-all-tags");
}