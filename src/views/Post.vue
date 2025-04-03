<script lang="ts" setup>
import { getPost, Post } from '@/api/api';
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const postId = computed(() => +route.params.postId as Post['id']);
const currentPage = route.params.currentPage
const post = ref<Post>();
const isLoading = ref<boolean>(true)

onBeforeMount(() => loadPost());

async function loadPost() {
  post.value = await getPost(postId.value);
  isLoading.value = false;
}
</script>

<template>
  <h1 v-if="isLoading">Loading Post...</h1>
  <h1>Post {{ postId }}</h1>
  <RouterLink class="back" :to="{ name: 'posts', params: { currentPage: currentPage } }">Back</RouterLink>
  <template v-if="post">
    <h3>{{ post.title }}</h3>
    <div>{{ post.body }}</div>
  </template>
</template>

<style scoped>
.back {
  color: #46f;
}
</style>
