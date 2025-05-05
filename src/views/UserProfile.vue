<template>
    <div class="user-profile">
      <template v-if="loading">
        <vue-skeleton height="200" />
        <vue-skeleton circle height="60" width="60" />
      </template>
      <template v-else-if="error">
        <v-alert type="error" variant="tonal">{{ error }}</v-alert>
      </template>
      <template v-else>
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="mb-4">
              <v-card-text>
                <div class="d-flex align-center mb-3">
                  <v-avatar size="80" class="mr-3">
                    <v-img :src="`https://secure.gravatar.com/avatar/${user.gravatar}?s=80`" :alt="user.name" />
                  </v-avatar>
                  <div>
                    <h3 class="text-h4">{{ user.name }}</h3>
                  </div>
                </div>
                <div>{{ user.micropostCount }} micropost{{ user.micropostCount !== 1 ? 's' : '' }}</div>
              </v-card-text>
            </v-card>
  
            <v-card>
              <v-card-text>
                <div class="d-flex justify-space-around">
                  <router-link :to="`/users/${user.id}/following`" class="text-decoration-none">
                    <div class="text-center">
                      <div class="text-h6">{{ user.followingCount }}</div>
                      <div>following</div>
                    </div>
                  </router-link>
                  <router-link :to="`/users/${user.id}/followers`" class="text-decoration-none">
                    <div class="text-center">
                      <div class="text-h6">{{ user.followersCount }}</div>
                      <div>followers</div>
                    </div>
                  </router-link>
                </div>
                
                <div v-if="sessionStore.user.id !== user.id" class="text-center mt-4">
                  <v-btn
                    v-if="isFollowing"
                    color="error"
                    variant="outlined"
                    @click="unfollowUser"
                    :loading="followLoading"
                  >
                    Unfollow
                  </v-btn>
                  <v-btn
                    v-else
                    color="primary"
                    @click="followUser"
                    :loading="followLoading"
                  >
                    Follow
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
  
          <v-col cols="12" md="8">
            <h3 class="text-h5 mb-4">Microposts</h3>
            
            <template v-if="microposts.length > 0">
              <v-list class="mb-4">
                <v-list-item
                  v-for="item in microposts"
                  :key="item.id"
                  :id="`micropost-${item.id}`"
                  class="mb-3"
                >
                  <template v-slot:prepend>
                    <v-avatar size="40" class="mr-3">
                      <v-img
                        :src="`https://secure.gravatar.com/avatar/${item.gravatar_id}?s=${item.size}`"
                        :alt="item.user_name"
                      />
                    </v-avatar>
                  </template>
                  
                  <v-list-item-title>
                    <router-link :to="`/users/${item.user_id}`">{{ item.user_name }}</router-link>
                  </v-list-item-title>
                  
                  <v-list-item-subtitle>
                    <div class="mt-2">{{ item.content }}</div>
                    <v-img
                      v-if="item.image"
                      :src="item.image"
                      alt="Post image"
                      class="mt-2"
                      max-height="400"
                      contain
                    ></v-img>
                    <div class="mt-2 text-caption">
                      Posted {{ item.timestamp }} ago.
                      <a
                        v-if="sessionStore.user.id === item.user_id"
                        href="#"
                        @click.prevent="removeMicropost(item.id)"
                        class="ml-2"
                      >
                        delete
                      </a>
                    </div>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
              
              <div class="text-center">
                <v-pagination
                  v-model="page"
                  :length="Math.ceil(totalCount / 5)"
                  @update:model-value="handlePageChange"
                ></v-pagination>
              </div>
            </template>
            <v-alert v-else type="info" variant="tonal">
              No microposts found
            </v-alert>
          </v-col>
        </v-row>
      </template>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useToast } from 'vue-toastification'
  import { useSessionStore } from '../stores/session'
  import api from '../api'
  import micropostApi, { Micropost } from '../api/micropostApi'
  import VueSkeleton from 'vue-loading-skeleton'
  
  const route = useRoute()
  const toast = useToast()
  const sessionStore = useSessionStore()
  
  const loading = ref(true)
  const error = ref('')
  const user = ref({
    id: '',
    name: '',
    gravatar: '',
    micropostCount: 0,
    followingCount: 0,
    followersCount: 0
  })
  const isFollowing = ref(false)
  const followLoading = ref(false)
  const page = ref(1)
  const microposts = ref<Micropost[]>([])
  const totalCount = ref(0)
  const userId = ref<string | string[]>('')
  
  onMounted(() => {
    userId.value = route.params.id
    fetchUserProfile()
  })
  
  const fetchUserProfile = async () => {
    try {
      loading.value = true
      const response = await api.get(`/users/${userId.value}`)
      user.value = response.data.user
      isFollowing.value = response.data.following
      await fetchUserMicroposts()
    } catch (err) {
      error.value = 'Failed to load user profile'
    } finally {
      loading.value = false
    }
  }
  
  const fetchUserMicroposts = async () => {
    try {
      const response = await api.get(`/users/${userId.value}/microposts`, {
        params: { page: page.value }
      })
      microposts.value = response.data.microposts
      totalCount.value = response.data.total_count
    } catch (err) {
      toast.error('Failed to load microposts')
    }
  }
  
  const handlePageChange = (newPage: number) => {
    page.value = newPage
  }
  
  const followUser = async () => {
    try {
      followLoading.value = true
      await api.post(`/users/${userId.value}/follow`)
      isFollowing.value = true
      user.value.followersCount++
      toast.success(`You are now following ${user.value.name}`)
    } catch (err) {
      toast.error('Failed to follow user')
    } finally {
      followLoading.value = false
    }
  }
  
  const unfollowUser = async () => {
    try {
      followLoading.value = true
      await api.delete(`/users/${userId.value}/unfollow`)
      isFollowing.value = false
      user.value.followersCount--
      toast.success(`You have unfollowed ${user.value.name}`)
    } catch (err) {
      toast.error('Failed to unfollow user')
    } finally {
      followLoading.value = false
    }
  }
  
  const removeMicropost = async (micropostId: number) => {
    const confirmed = window.confirm('Are you sure?')
    if (confirmed) {
      try {
        const response = await micropostApi.remove(micropostId)
        if (response.flash) {
          toast.success(response.flash[1])
          await fetchUserMicroposts()
          user.value.micropostCount--
        }
      } catch (error) {
        toast.error('Failed to delete micropost')
      }
    }
  }
  
  watch(() => route.params.id, (newId) => {
    userId.value = newId
    fetchUserProfile()
  })
  watch(() => page.value, fetchUserMicroposts)
  </script>
  