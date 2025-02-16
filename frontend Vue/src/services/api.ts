import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAllContatos = () => api.get("/contatos");
export const getContatoById = (id: number) => api.get(`/contatos/${id}`);
export const createContato = (contato: any) => api.post("/contatos", contato);
export const updateContato = (id: number, contato: any) =>
  api.put(`/contatos/${id}`, contato);
export const deleteContato = (id: number) => api.delete(`/contatos/${id}`);
