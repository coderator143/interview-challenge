<template>
    <div>
        <div class="pagination-row">
            <button class = "pagination-button" > Previous </button>
            <span v-for="(item, index) in new Array(numPages)" :key="index">
                <button @click = "loadPosts(index+1)" class = "pagination-button" >{{ index + 1 }}</button>
            </span>
            <button class = "pagination-button" > Next </button>
        </div>
        <slot />
    </div>
</template>

<script setup>
    defineProps({
        loadPosts: Function,
        numPages: Number
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