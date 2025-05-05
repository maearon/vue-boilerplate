<template>
    <div class="container py-4">
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
  
      <div v-else>
        <div class="text-center mb-6">
          <v-avatar size="100" class="mb-3">
            <v-img
              :src="`https://secure.gravatar.com/avatar/${sessionUser.gravatar}?s=100`"
              :alt="sessionUser.name"
            />
          </v-avatar>
          <h1 class="text-h4">{{ sessionUser.name }}</h1>
        </div>
  
        <v-tabs v-model="activeTab" centered class="mb-6">
          <v-tab :to="`/users/${userId}`">Profile</v-tab>
          <v-tab :to="`/users/${userId}/following`">Following</v-tab>
          <v-tab :to="`/users/${userId}/followers`">Followers</v-tab>
        </v-tabs>
  
        <h2 class="text-h5 mb-4">{{ type === 'following' ? 'Following' : 'Followers' }}</h2>
  
        <div v-if="users.length === 0" class="text-center py-4">
          <p>No {{ type === 'following' ? 'following' : 'followers' }} yet.</p>
        </div>
  
        <v-list v-else>
          <v-list-item v-for="followUser in users" :key="followUser.id" class="mb-2">
            <template v-slot:prepend>
              <v-avatar size="40" class="mr-3">
                <v-img
                  :src="`https://secure.gravatar.com/avatar/${followUser.gravatar_id}?s=40`"
                  :alt="followUser.name"
                />
              </v-avatar>
            </template>
            <v-list-item-title>
              <router-link :to="`/users/${followUser.id}`">{{ followUser.name }}</router-link>
            </v-list-item-title>
          </v-list-item>
        </v-list>
  
        <div v-if="totalCount > 10" class="text-center mt-4">
          <v-pagination
            v-model="page"
            :length="Math.ceil(totalCount / 10)"
            @update:model-value="handlePageChange"
          ></v-pagination>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, computed } from 'vue'
  import { useToast } from 'vue-toastification'
  import { useSessionStore } from '../stores/session'
  import userApi, { UserFollow } from '../api/userApi'
  
  const props = defineProps<{
    userId: string
    type: 'following' | 'followers'
  }>()
  
  const toast = useToast()
  const session = useSessionStore()
  
  const activeTab = ref(props.type === 'following' ? 1 : 2)
  const loading = ref(true)
  const page = ref(1)
  const users = ref<UserFollow[]>([])
  const totalCount = ref(0)
  
  // Lấy user từ Pinia session store (không gọi lại API nếu đã có)
  const sessionUser = computed(() => session.user)
  
  // Gọi API để lấy danh sách người theo dõi / đang theo dõi
  const fetchData = async () => {
    loading.value = true
    try {
      const response = await userApi.follow(props.userId, page.value, props.type)
      users.value = response.users
      totalCount.value = response.total_count
    } catch (error) {
      console.error(error)
      toast.error(`Failed to fetch ${props.type}`)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(fetchData)
  
  watch(() => page.value, fetchData)
  
  watch(() => props.type, () => {
    activeTab.value = props.type === 'following' ? 1 : 2
    page.value = 1
    fetchData()
  })
  
  watch(() => props.userId, () => {
    page.value = 1
    fetchData()
  })
  
  const handlePageChange = (newPage: number) => {
    page.value = newPage
  }
  </script>
  