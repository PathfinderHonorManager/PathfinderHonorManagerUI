<template>
  <div class="outline">
    <form
      class="pathfinder-form"
      @submit.prevent="submitForm"
    >
      <div>
        <h3>First Name:</h3>
        <input
          v-model="firstName"
          type="text"
        >
        <p
          v-if="firstNameError"
          class="error-text"
        >
          {{ firstNameError }}
        </p>
      </div>
      <div>
        <h3>Last Name:</h3>
        <input
          v-model="lastName"
          type="text"
        >
        <p
          v-if="lastNameError"
          class="error-text"
        >
          {{ lastNameError }}
        </p>
      </div>
      <div>
        <h3>Email:</h3>
        <input
          v-model="email"
          type="text"
        >
        <p
          v-if="emailError"
          class="error-text"
        >
          {{ emailError }}
        </p>
      </div>
      <div>
        <h3>Grade:</h3>
        <input
          v-model="grade"
          type="text"
        >
        <p
          v-if="gradeError"
          class="error-text"
        >
          {{ gradeError }}
        </p>
      </div>
      <div class="submit-container">
        <input
          type="submit"
          class="button-like"
          value="Add Pathfinder"
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['submit', 'cancel']);

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const grade = ref('');
const firstNameError = ref('');
const lastNameError = ref('');
const emailError = ref('');
const gradeError = ref('');

const clearForm = () => {
  firstName.value = '';
  lastName.value = '';
  email.value = '';
  grade.value = '';
  firstNameError.value = '';
  lastNameError.value = '';
  emailError.value = '';
  gradeError.value = '';
};

const setServerErrors = (fieldErrors: Record<string, string[]>) => {
  firstNameError.value = fieldErrors.FirstName?.[0] || fieldErrors.firstName?.[0] || '';
  lastNameError.value = fieldErrors.LastName?.[0] || fieldErrors.lastName?.[0] || '';
  emailError.value = fieldErrors.Email?.[0] || fieldErrors.email?.[0] || '';
  gradeError.value = fieldErrors.Grade?.[0] || fieldErrors.grade?.[0] || '';
};

const validateForm = () => {
  let isValid = true;
  
  if (firstName.value === '') {
    firstNameError.value = 'First name is required';
    isValid = false;
  } else {
    firstNameError.value = '';
  }
  
  if (lastName.value === '') {
    lastNameError.value = 'Last name is required';
    isValid = false;
  } else {
    lastNameError.value = '';
  }
  
  if (grade.value !== '' && (Number(grade.value) < 5 || Number(grade.value) > 12)) {
    gradeError.value = 'Grade must be between 5 and 12';
    isValid = false;
  } else {
    gradeError.value = '';
  }
  
  if (email.value === '' || !email.value.includes('@')) {
    emailError.value = 'Invalid email';
    isValid = false;
  } else {
    emailError.value = '';
  }

  return isValid;
};

const submitForm = () => {
  if (validateForm()) {
    const data = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      grade: grade.value === '' ? null : Number(grade.value)
    };
    
    emit('submit', data);
  }
};

defineExpose({
  clearForm,
  setServerErrors
});
</script>

<style scoped>
.pathfinder-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  align-items: start;
  justify-items: stretch;
  margin: 10px;
}

.submit-container {
  grid-column: 1 / -1; 
  justify-self: center;
}

.button-like {
  font-size: 1.5em; 
  margin-top: 20px; 
  width: auto;
}

.error-text {
  color: #cc0000;
  font-size: 0.85em;
  margin-top: 5px;
}
</style> 