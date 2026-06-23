
import axios from "axios";

const API = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

export const createProject = (formData) => {
    return API.post("/projects/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const getProjects = () => {
    return API.get("/projects");
};
