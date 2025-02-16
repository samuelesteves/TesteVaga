import { createRouter, createWebHistory } from "vue-router";
import CadastroContato from "@/components/CadastroContato.vue";
import ListagemContatos from "@/components/ListagemContatos.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: ListagemContatos,
  },
  {
    path: "/cadastro",
    name: "cadastro",
    component: CadastroContato,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
