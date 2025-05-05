<template>
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1>Về chúng tôi</h1>
          <div class="card mt-4">
            <div class="card-body">
              <h2>Ứng dụng mạng xã hội mẫu</h2>
              <p>
                Đây là một ứng dụng mạng xã hội mẫu được xây dựng bằng Vue.js. Ứng dụng này cho phép người dùng:
              </p>
              <ul>
                <li>Đăng ký và đăng nhập</li>
                <li>Đăng bài viết với hình ảnh</li>
                <li>Theo dõi người dùng khác</li>
                <li>Xem bài viết từ những người mà họ theo dõi</li>
              </ul>
              <p>
                Ứng dụng này được phát triển như một dự án mẫu để học Vue.js và các công nghệ liên quan.
              </p>
              <h3>Công nghệ sử dụng</h3>
              <ul>
                <li>Vue 3 với Composition API</li>
                <li>Pinia cho quản lý trạng thái</li>
                <li>Vue Router cho điều hướng</li>
                <li>Axios cho gọi API</li>
                <li>Vuetify và Bootstrap cho UI</li>
              </ul>
            </div>
          </div>
          <div class="text-center mt-4">
            <router-link to="/contact" class="btn btn-primary">Liên hệ với chúng tôi</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // No additional logic needed
  </script>
  