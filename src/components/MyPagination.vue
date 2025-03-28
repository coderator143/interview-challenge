<template>
    <div>
        <div class="pagination-row">
            <button class = "pagination-button" @click="currentPage > 1 && loadPosts(currentPage - 1)"> Previous </button>
            <span v-for="(item, index) in new Array(numPages)" :key="index">
                <button @click = "loadPosts(index+1)" class = "pagination-button" >{{ index + 1 }}</button>
            </span>
            <button class = "pagination-button" @click="currentPage < numPages && loadPosts(currentPage + 1)"> Next </button>
        </div>
        <slot />
    </div>
</template>

<script setup>
    defineProps({
        loadPosts: Function,
        numPages: Number,
        currentPage: Number
    });
</script>

<style lang="scss" scoped>
    .pagination-button {
        padding: 8px;
        margin: 2px;
        border-radius: 3px;
        font-size: 1em;
        cursor: pointer;
    }
</style>