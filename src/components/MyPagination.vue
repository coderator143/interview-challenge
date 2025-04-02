<template>
    <div>
        <div v-if="size > 1" class="pagination-row">
            <h1 class="pagination-button" @click="currentPage > 1 && onClickHandler(currentPage - 1)">
                Previous
            </h1>
            <span v-for="(item, index) in leftArray" :key="index">
                <h1 @click="onClickHandler(item)" class="pagination-button"
                    :class="{ 'selected': item === currentPage }">
                    {{ item }}
                </h1>
            </span>

            <h3 class="dots" v-if="size > 2 && !isOverlapped">  ...  </h3>

            <span v-for="(item, index) in middleArray" :key="index">
                <h1 @click="onClickHandler(item)" class="pagination-button"
                    :class="{ 'selected': item === currentPage }">
                    {{ item }}
                </h1>
            </span>

            <h3 class="dots" v-if="middleArray.length > 0">  ...  </h3>

            <span v-for="(item, index) in rightArray" :key="index">
                <h1 @click="onClickHandler(item)" class="pagination-button"
                    :class="{ 'selected': item === currentPage }">
                    {{ item }}
                </h1>
            </span>
            <h1 class="pagination-button" @click="currentPage < numPages && onClickHandler(currentPage + 1)">
                Next
            </h1>
        </div>
        <slot />
        <p>Current Page: {{ currentPage }}</p>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';

const props = defineProps({
    loadPosts: Function,
    numPages: Number,
    currentPage: Number
});

/* pagination component displays the correct page if 
   you are landing for the first time or after viewing a post */
onBeforeMount(() => calculateSpan(props.currentPage));

let size = props.numPages // total number of pages
let leftArray = ref([]), middleArray = ref([]), rightArray = ref([]); 
let isOverlapped = ref(false)

// Change the pagination component on clicking different pages
const calculateSpan = (selectedPage) => {
    let array = [];

    // base case for size < 2 so we don't render the middle and right section
    if (size <= 2) {
        for (let x = 1; x <= size; x++) {
            array.push(x);
        }
        leftArray.value = array;
        middleArray.value = [];
        rightArray.value = [];
        return;
    }

    if (selectedPage <= 5) { // left array manipulation
        rightArray.value = [size-1, size]; // reset the right section

        // show the next two pages in the left section to naviagate to middle section
        for (let x = 1; x <= selectedPage + 2; x++) array.push(x);

        // if left section is overlapping with the right section, create one single big left array
        if (rightArray.value[0] - array[array.length - 1] <= 1) {
            array = rightArray.value = [];
            for (let x = 1; x <= size; x++) array.push(x);
            isOverlapped.value = true
        }

        leftArray.value = array;
        middleArray.value = []; // reset the middle section to empty
    } else if (selectedPage > 5 && selectedPage <= size - 5) { // middle array manipulation
        // show last 2 and next 2 pages to navigate to left and right sections freely
        for (let x = selectedPage - 2; x <= selectedPage + 2; x++) array.push(x);

        middleArray.value = array;
        leftArray.value = [1, 2]; // reset the left section
        rightArray.value = [size - 1, size]; // reset the right section
    } else if (selectedPage > size - 5) { // right array manipulation (max size 7)
        leftArray.value = [1, 2] // reset the left section

        // show the previous 2 pages to navigate to middle section
        for (let x = selectedPage-2; x <= size; x++) array.push(x);

        // if left section is overlapping with the right section, create one single big left array
        if (array[0] - leftArray.value[leftArray.value.length - 1] <= 1) {
            array = rightArray.value = []
            for (let x = 1; x <= size; x++) array.push(x);
            leftArray.value = array;
            isOverlapped.value = true;
            return;
        }

        rightArray.value = array
        middleArray.value = [] // no need of middle section when right section is active
    }
};

// function to perform 2 tasks - load the correct page and change the pagination component
const onClickHandler = (item) => {
    props.loadPosts(item);

    // if left and right sections overlap, no need to calculate different spans again
    if (!isOverlapped.value) calculateSpan(item);
}
</script>

<style lang="scss" scoped>
.pagination-row {
    display: inline-flex;
}

.dots {
    position: relative;
    top: -10px;
}

.pagination-button {
    padding: 8px;
    margin: 2px;
    border-radius: 3px;
    font-size: 1em;
    cursor: pointer;
}

.pagination-button.selected {
    background-color: #007bff;
    color: white;
    font-weight: bold;
    border: 1px solid #0056b3;
}
</style>