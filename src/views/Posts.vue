<script lang="ts" setup>
import { getPosts, Post } from '@/api/api';
import { onBeforeMount, ref } from 'vue';
import MyPagination from '@/components/MyPagination.vue'
import { useRoute } from 'vue-router';

const route = useRoute()
const posts = ref<Post[]>();
let pagePosts = ref<Post[]>();
let numPages = ref(0); // reactive state
let currentPage = ref(1)

onBeforeMount(() => loadPosts());

async function loadPosts() {
  /* to check if the page is loaded for the first time or
     after the clicking the back button */
  let pageFromRoute = route.params.currentPage
  if (pageFromRoute !== undefined) {
    currentPage.value = Number(pageFromRoute)
  }

  // getting all posts and calculating number of pages
  posts.value = (await getPosts()).posts;
  posts.value = [...posts.value, ...posts.value, ...posts.value]
  numPages.value = Math.ceil(posts?.value?.length / 5);

  // loading posts on current page
  loadPostsPerPage(currentPage.value);
}

/* seperate function being used in pagination component
   to avoid api calling everytime a page changes */
function loadPostsPerPage(page = 1) {
  let postStartIndex = page * 5 - 5, postEndIndex = page * 5
  pagePosts.value = posts?.value?.slice(postStartIndex, postEndIndex)
  currentPage.value = page
}
</script>

<template>
  <h1>Posts list</h1>
  <MyPagination v-if="numPages > 0" :loadPosts="loadPostsPerPage" :numPages="numPages" :currentPage="currentPage">
    <RouterLink class="post" v-for="(post, index) of pagePosts"
      :to="{ name: 'post', params: { postId: post.id, currentPage: currentPage } }" :key="index">
      <div class="post__id">#{{ post.id }}</div>
      <div class="post__title">{{ post.title }}</div>
      <div>{{ post.body }}</div>
    </RouterLink>
  </MyPagination>
</template>

<style scoped>
.post {
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-template-rows: repeat(2, auto);
  gap: 8px;

  &+& {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #ccc;
  }

  &__id {
    grid-row: -1/1;
  }

  &__title {
    font-weight: 700;
  }
}
</style>