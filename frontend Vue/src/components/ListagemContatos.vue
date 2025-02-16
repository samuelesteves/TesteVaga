<template>
  <div class="form-container">
    <div class="header">
      <h2>Lista de Contatos</h2>
      <button @click="goToCadastro">Cadastrar Novo Contato</button>
      <button @click="gerarLogTxt" class="log-button">Log</button>
    </div>

    <input
      v-model="searchQuery"
      type="text"
      placeholder="Buscar por nome ou telefone"
      class="search-input"
    />

    <ul>
      <li
        v-for="contato in contatosFiltrados"
        :key="contato.ID"
        class="contact-item"
      >
        <div class="contact-info" @click="toggleContato(contato.ID)">
          <span>{{ contato.NOME }} - {{ contato.IDADE }} anos</span>
          <div class="actions">
            <button @click="editarContato(contato.ID)">Editar</button>
            <button @click="excluirContato(contato.ID)">Excluir</button>
          </div>
        </div>
        <div v-if="contato.isExpanded" class="telefone-info">
          <p><strong>Telefones:</strong></p>
          <ul>
            <li v-for="telefone in contato.telefones" :key="telefone.ID">
              {{ telefone.NUMERO }}
              <button @click="excluirTelefone(contato.ID, telefone.ID)">
                Excluir
              </button>
            </li>
          </ul>
          <input
            v-model="newTelefone.NUMERO"
            type="text"
            placeholder="Novo Telefone"
            maxlength="15"
          />
          <button @click="addTelefone(contato.ID)">Adicionar Telefone</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getAllContatos, deleteContato, updateContato } from "@/services/api";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const contatos = ref([]);
const newTelefone = ref({ NUMERO: "" });
const searchQuery = ref("");
const router = useRouter();
const logs = ref([]);

const isValidId = (id) => id && !isNaN(Number(id));

const editarContato = (id) => {
  if (!isValidId(id)) {
    toast.error("ID inválido. Não foi possível editar o contato.");
    return;
  }
  router.push(`/cadastro?id=${id}`);
};

const excluirContato = async (id) => {
  if (!isValidId(id)) {
    toast.error("ID inválido. Não foi possível excluir o contato.");
    return;
  }

  const contato = contatos.value.find((c) => c.ID === id);
  if (contato) {
    logs.value.push({
      nome: contato.NOME,
      idade: contato.IDADE,
      telefones: contato.telefones.map((t) => t.NUMERO).join(", "),
      id: contato.ID,
      dataExclusao: new Date().toLocaleString(),
    });
  }

  try {
    await deleteContato(id);
    contatos.value = contatos.value.filter((c) => c.ID !== id);
    toast.success("Contato excluído com sucesso!");
  } catch (error) {
    toast.error("Ocorreu um erro ao excluir o contato.");
  }
};

const gerarLogTxt = () => {
  let logText = "Logs de exclusão de contatos:\n\n";
  logs.value.forEach((log) => {
    logText += `ID: ${log.id}\nNome: ${log.nome}\nIdade: ${log.idade}\nTelefones: ${log.telefones}\nData de Exclusão: ${log.dataExclusao}\n\n`;
  });

  const blob = new Blob([logText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "logs_contatos_excluidos.txt";
  link.click();
};

const carregarContatos = async () => {
  try {
    const response = await getAllContatos();
    if (Array.isArray(response.data.data)) {
      contatos.value = response.data.data.map((contato) => ({
        ...contato,
        isExpanded: false,
      }));
    }
  } catch (error) {
    toast.error("Ocorreu um erro ao carregar os contatos.");
  }
};

onMounted(() => {
  carregarContatos();
});

const toggleContato = (id) => {
  const contato = contatos.value.find((c) => c.ID === id);
  if (contato) {
    contato.isExpanded = !contato.isExpanded;
  }
};

const addTelefone = async (id) => {
  if (!newTelefone.value.NUMERO) {
    toast.error("Por favor, insira um número de telefone.");
    return;
  }
  const contato = contatos.value.find((c) => c.ID === id);
  if (contato) {
    contato.telefones.push({ NUMERO: newTelefone.value.NUMERO });

    try {
      await updateContato(contato.ID, {
        NOME: contato.NOME,
        IDADE: contato.IDADE,
        telefones: contato.telefones,
      });
      toast.success("Telefone adicionado com sucesso!");
      carregarContatos();
    } catch (error) {
      toast.error("Erro ao adicionar telefone.");
    }

    newTelefone.value.NUMERO = "";
  }
};

const excluirTelefone = async (contatoId, telefoneId) => {
  const contato = contatos.value.find((c) => c.ID === contatoId);
  if (contato) {
    const telefoneIndex = contato.telefones.findIndex(
      (t) => t.ID === telefoneId
    );
    if (telefoneIndex !== -1) {
      contato.telefones.splice(telefoneIndex, 1);
      try {
        await updateContato(contato.ID, {
          NOME: contato.NOME,
          IDADE: contato.IDADE,
          telefones: contato.telefones,
        });
        toast.success("Telefone excluído com sucesso!");
        carregarContatos();
      } catch (error) {
        toast.error("Erro ao excluir telefone.");
      }
    }
  }
};

const contatosFiltrados = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return contatos.value.filter((contato) => {
    const nomeMatches = contato.NOME.toLowerCase().includes(query);
    const telefoneMatches = contato.telefones.some((telefone) =>
      telefone.NUMERO.includes(query)
    );
    return nomeMatches || telefoneMatches;
  });
});

const goToCadastro = () => {
  router.push("/cadastro");
};
</script>

<style scoped>
.form-container {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  border-radius: 16px;
  margin: 30px auto;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.contact-item {
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 10px;
  text-align: left;
}

.contact-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  background: transparent;
  color: black;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: "Roboto", sans-serif;
  transition: color 0.3s ease;
}

button:hover {
  color: rgba(34, 193, 195, 1);
}

button:focus {
  outline: none;
}

button:active {
  transform: scale(0.98);
}

.telefone-info {
  margin-top: 10px;
  padding-left: 10px;
  border-left: 2px solid rgba(255, 255, 255, 0.3);
  text-align: left;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
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

/* Estilo do botão de log */
.log-button {
  background-color: transparent;
  color: black;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: "Roboto", sans-serif;
  transition: color 0.3s ease;
  margin-right: 10px;
}

.log-button:hover {
  color: rgba(34, 193, 195, 1);
}
</style>
