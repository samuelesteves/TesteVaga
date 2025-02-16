<template>
  <div id="app">
    <header>
      <h1>Agenda Telefônica</h1>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>Samuel Esteves Silva - Agenda Telefônica</p>
    </footer>
  </div>
</template>

<script setup></script>

<style scoped>
header {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 0, 0, 0.1);
  padding: 20px;
}

footer {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 0, 0, 0.1);
  padding: 20px;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

#app {
  font-family: "Roboto", sans-serif;
  height: 100vh;
  background: rgb(34, 193, 195);
  background: linear-gradient(
    0deg,
    rgba(34, 193, 195, 1) 0%,
    rgba(253, 187, 45, 1) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.list-container,
.form-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 800px;
}

button {
  background: linear-gradient(
    0deg,
    rgba(34, 193, 195, 1) 0%,
    rgba(253, 187, 45, 1) 100%
  );
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.4s ease, transform 0.2s ease;
}

button:hover {
  background: linear-gradient(
    0deg,
    rgba(253, 187, 45, 1) 0%,
    rgba(34, 193, 195, 1) 100%
  );
  transform: scale(1.05);
}

button:focus {
  outline: none;
}
</style>
