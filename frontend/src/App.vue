<script setup>
import { ref } from "vue";

const name = ref("");
const email = ref("");
let file = null;
const handleFileUpload = (event) => {
  const selectedFile = event.target.files[0];
  console.log("Selected File:", selectedFile);
  file = selectedFile;
};

const submitForm = () => {
  console.log(`name: ${name.value} email: ${email.value} file: ${file.name}`);
  const formData = new FormData();

  formData.append("name", name.value);
  formData.append("email", email.value);
  formData.append("file", file);
  console.log("Form Data:", formData);

  fetch("/api/submit", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};
</script>

<template>
  <div>
    <h1>Form</h1>

    <form @submit.prevent="submitForm" enctype="multipart/form-data">
      <div>
        <label for="name">Name</label>
        <input type="text" name="name" id="name" v-model="name" required />
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" name="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="file">File</label>
        <input
          type="file"
          name="file"
          id="file"
          @change="handleFileUpload"
          required
        />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
