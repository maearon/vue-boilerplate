<template>
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1>Liên hệ</h1>
          <div class="card mt-4">
            <div class="card-body">
              <form @submit.prevent="submitForm">
                <div class="mb-3">
                  <label for="name" class="form-label">Họ tên</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name" 
                    v-model="form.name" 
                    required
                  >
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    v-model="form.email" 
                    required
                  >
                </div>
                <div class="mb-3">
                  <label for="message" class="form-label">Tin nhắn</label>
                  <textarea 
                    class="form-control" 
                    id="message" 
                    rows="5" 
                    v-model="form.message" 
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  :disabled="submitting"
                >
                  {{ submitting ? 'Đang gửi...' : 'Gửi tin nhắn' }}
                </button>
              </form>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-body">
              <h3>Thông tin liên hệ</h3>
              <p><strong>Địa chỉ:</strong> 123 Đường Mẫu, Thành phố Mẫu</p>
              <p><strong>Email:</strong> contact@example.com</p>
              <p><strong>Điện thoại:</strong> (123) 456-7890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useToast } from 'vue-toastification';
  
  const toast = useToast();
  const submitting = ref(false);
  const form = ref({
    name: '',
    email: '',
    message: ''
  });
  
  const submitForm = async () => {
    submitting.value = true;
    
    try {
      // Giả lập gửi form
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      form.value = {
        name: '',
        email: '',
        message: ''
      };
      
      toast.success('Tin nhắn của bạn đã được gửi thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
    } finally {
      submitting.value = false;
    }
  };
  </script>
  