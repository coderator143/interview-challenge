<script lang="ts" setup>
import { getPosts, Post } from '@/api/api';
import { onBeforeMount, ref } from 'vue';
import MyPagination from '@/components/MyPagination.vue'
import { useRoute } from 'vue-router';

const route = useRoute()
const posts = ref<Post[]>(), pagePosts = ref<Post[]>();
const numPages = ref(0), currentPage = ref(1)
const apiError = ref<string>('')
const isLoading = ref<boolean>(true)
let numPosts = 6

onBeforeMount(() => loadPosts());

async function loadPosts() {
  try {
    /* to check if the page is loaded for the first time or
     after the clicking the back button */
    let pageFromRoute = route.params.currentPage
    if (pageFromRoute !== undefined) {
      currentPage.value = Number(pageFromRoute)
    }

    // getting all posts and calculating number of pages
    posts.value = (await getPosts()).posts;
    posts.value = [...posts.value, ...posts.value]
    numPages.value = Math.ceil(posts?.value?.length / numPosts);

    isLoading.value = false; // stop loading when posts are fetched

    // loading posts on current page
    loadPostsPerPage(currentPage.value);
  } catch (error) {
    console.error("Failed to load posts: ", error);
    apiError.value = "Something went wrong! Please try again";
  }
}

/* seperate function being used in pagination component
   to avoid api calling everytime a page changes */
function loadPostsPerPage(page = 1) {
  let postStartIndex = page * numPosts - numPosts, postEndIndex = page * numPosts
  pagePosts.value = posts?.value?.slice(postStartIndex, postEndIndex)
  currentPage.value = page
}
</script>

<template>
  <h1 v-if="isLoading">Loading posts...</h1>

  <h1 v-if="numPages > 0">Posts list</h1>

  <MyPagination v-if="numPages > 0" :loadPosts="loadPostsPerPage" :numPages="numPages" :currentPage="currentPage">
    <RouterLink class="post" v-for="(post, index) of pagePosts"
      :to="{ name: 'post', params: { postId: post.id, currentPage: currentPage } }" :key="index">
      <div class="post__id">#{{ post.id }}</div>
      <div class="post__title">{{ post.title }}</div>
      <div>{{ post.body }}</div>
    </RouterLink>
  </MyPagination>

  <h1 v-if="numPages === 0 && apiError.length === 0 && !isLoading">No posts to display</h1>

  <h1 v-if="apiError.length > 0">{{ apiError }}</h1>
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