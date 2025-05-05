<template>
    <div class="signup-page">
      <h1 class="text-h4 text-center mb-6">Sign up</h1>
      
      <v-card max-width="500" class="mx-auto">
        <v-card-text>
          <v-form @submit.prevent="handleSubmit">
            <div v-if="errors.length" class="mb-4">
              <v-alert type="error" variant="tonal">
                <ul class="mb-0 pl-4">
                  <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                </ul>
              </v-alert>
            </div>
            
            <v-text-field
              v-model="name"
              label="Name"
              required
              :error-messages="nameError"
              @input="resetFieldError('name')"
            ></v-text-field>
            
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              required
              :error-messages="emailError"
              @input="resetFieldError('email')"
            ></v-text-field>
            
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              required
              :error-messages="passwordError"
              @input="resetFieldError('password')"
            ></v-text-field>
            
            <v-text-field
              v-model="passwordConfirmation"
              label="Confirm Password"
              type="password"
              required
              :error-messages="passwordConfirmationError"
              @input="resetFieldError('passwordConfirmation')"
            ></v-text-field>
            
            <v-btn
              type="submit"
              color="primary"
              block
              :loading="loading"
              class="mt-4"
            >
              Create my account
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useToast } from 'vue-toastification'
  import { useSessionStore } from '../stores/session'
  import api from '../api'
  
  const router = useRouter()
  const toast = useToast()
  const sessionStore = useSessionStore()
  
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const passwordConfirmation = ref('')
  const loading = ref(false)
  const errors = ref<string[]>([])
  const nameError = ref('')
  const emailError = ref('')
  const passwordError = ref('')
  const passwordConfirmationError = ref('')
  
  const resetFieldError = (field: string) => {
    switch (field) {
      case 'name':
        nameError.value = ''
        break
      case 'email':
        emailError.value = ''
        break
      case 'password':
        passwordError.value = ''
        break
      case 'passwordConfirmation':
        passwordConfirmationError.value = ''
        break
    }
    errors.value = []
  }
  
  const handleSubmit = async () => {
    errors.value = []
    nameError.value = ''
    emailError.value = ''
    passwordError.value = ''
    passwordConfirmationError.value = ''
    loading.value = true
    
    try {
      const response = await api.post('/signup', {
        user: {
          name: name.value,
          email: email.value,
          password: password.value,
          password_confirmation: passwordConfirmation.value
        }
      })
      
      const { token, remember_token } = response
      
      localStorage.setItem('token', token)
      localStorage.setItem('remember_token', remember_token)
      
      await sessionStore.fetchUser()
      toast.success('Account created successfully!')
      router.push('/')
    } catch (err: any) {
      if (err.response && err.response) {
        const { error: serverError } = err.response
        
        if (Array.isArray(serverError)) {
          errors.value = serverError
        } else if (typeof serverError === 'object') {
          if (serverError.name) nameError.value = serverError.name
          if (serverError.email) emailError.value = serverError.email
          if (serverError.password) passwordError.value = serverError.password
          if (serverError.password_confirmation) passwordConfirmationError.value = serverError.password_confirmation
        } else {
          errors.value = ['Sign up failed. Please try again.']
        }
      } else {
        errors.value = ['Sign up failed. Please try again.']
      }
    } finally {
      loading.value = false
    }
  }
  </script>
  