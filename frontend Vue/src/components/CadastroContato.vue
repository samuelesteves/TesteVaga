<template>
  <div class="form-container">
    <h2>{{ isEditMode ? "Editar Contato" : "Cadastro de Contato" }}</h2>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="nome">Nome</label>
        <input
          v-model="contato.NOME"
          type="text"
          id="nome"
          placeholder="Digite o nome"
          required
        />
      </div>
      <div>
        <label for="idade">Idade</label>
        <input
          v-model="contato.IDADE"
          type="number"
          id="idade"
          placeholder="Digite a idade"
          required
        />
      </div>
      <div>
        <label for="telefone">Telefone</label>
        <input
          v-model="newTelefone.NUMERO"
          type="text"
          id="telefone"
          placeholder="Digite o telefone"
          maxlength="15"
        />
      </div>

      <div class="button-container">
        <button type="submit">Salvar</button>
        <button @click="voltarParaLista">Voltar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import { createContato, updateContato, getContatoById } from "@/services/api";

const contato = ref({
  NOME: "",
  IDADE: "",
  telefones: [],
});

const newTelefone = ref({
  NUMERO: "",
});

const router = useRouter();
const route = useRoute();
const isEditMode = ref(false);

const voltarParaLista = () => {
  router.push("/");
};

const carregarContato = async () => {
  const contatoId = route.query.id;
  if (contatoId) {
    isEditMode.value = true;
    try {
      const response = await getContatoById(contatoId);
      const contatoData = response.data;
      contato.value = {
        NOME: contatoData.NOME,
        IDADE: contatoData.IDADE,
        telefones: contatoData.telefones || [],
      };
    } catch (error) {
      toast.error("Erro ao carregar os dados do contato.");
      console.error("Erro ao carregar contato:", error);
    }
  }
};

const handleSubmit = async () => {
  try {
    const contatoAtualizado = {
      NOME: contato.value.NOME,
      IDADE: contato.value.IDADE,
      telefones: [newTelefone.value],
    };

    if (isEditMode.value) {
      const contatoId = route.query.id;
      await updateContato(contatoId, contatoAtualizado);
      toast.success("Contato atualizado com sucesso!");
    } else {
      await createContato(contatoAtualizado);
      toast.success("Contato salvo com sucesso!");
    }
    router.push("/");
  } catch (error) {
    toast.error("Erro ao salvar contato.");
    console.error("Erro ao salvar contato:", error);
  }
};

onMounted(() => {
  carregarContato();
});
</script>

<style scoped>
.form-container {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin: 30px 0;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cadastro-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 600px;
  padding: 30px;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

form div {
  margin-bottom: 15px;
}

input {
  padding: 8px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  background: transparent;
  color: black;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  font-family: "Roboto", sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

button:hover {
  color: white;
  background: rgba(34, 193, 195, 0.6);
}

button:focus {
  outline: none;
}

button:active {
  transform: scale(0.98);
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  text-align: left;
  font-size: 16px;
  color: black;
}

input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}
</style>
