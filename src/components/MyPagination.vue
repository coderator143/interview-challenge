<template> 
    <div>
        <div class="pagination-row">
            <button 
                class = "pagination-button" 
                @click="currentPage > 1 && onClickHandler(currentPage - 1)"
            > 
                Previous 
            </button>
            <span 
                v-for="(item, index) in leftArray" 
                :key="index"
            >
                <button 
                    @click = "onClickHandler(item)" 
                    class = "pagination-button" 
                    :class="{ 'selected': item === currentPage }" 
                >
                    {{ item }}
                </button>
            </span>

            <span> ... </span>

            <span 
                v-for="(item, index) in middleArray" 
                :key="index"
            >
                <button 
                    @click = "onClickHandler(item)" 
                    class = "pagination-button" 
                    :class="{ 'selected': item === currentPage }" 
                >
                    {{ item }}
                </button>
            </span>

            <span v-if="middleArray.length > 0"> ... </span>

            <span v-for="(item, index) in rightArray" :key="index">
                <button 
                    @click = "onClickHandler(item)" 
                    class = "pagination-button" 
                    :class="{ 'selected': item === currentPage }" 
                >
                    {{ item }}
                </button>
            </span>
            <button 
                class = "pagination-button"
                @click="currentPage < numPages && onClickHandler(currentPage + 1)"
            > 
                Next 
            </button>
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
       you are landing for the first or after viewing a post */
    onBeforeMount(() => calculateSpan(props.currentPage))

    let size = props.numPages // total number of pages
    let leftArray = ref([1, 2, 3]) // intial left section showing first 3 pages
    let middleArray = ref([])  // don't show the middle section in the pagination component initially
    let rightArray = ref([size-2, size-1, size]) // initial right section showing last 3 pages

    // Change the pagination component on clicking different pages
    const calculateSpan = (selectedPage) => {
        let array = [];

        // left array manipulation
        if (selectedPage <= 4) {
            // show the next two pages as well in the left section on clicking a page for a max of 6
            for(let x=1;x<=selectedPage+2;x++) {
                array.push(x)
            }
            leftArray.value = array;
            middleArray.value = []    
        } else if (selectedPage > 4 && selectedPage < size-4) { // middle array manipulation
            /* keep one page from the left section so as to restore 
            the left section if user clicks page 4 */
            for(let x=selectedPage-1; x<=selectedPage+1; x++) {
                array.push(x)
            }
            middleArray.value = array

            /* the left and right sections contain the first two and last two pages 
               respectively while we are scrolling the pages in the middle section */
            leftArray.value = [1, 2, 3]
            rightArray.value = [size-2, size-1, size]
        } else if (selectedPage >= size-4) { // right array manipulation (max size 6)
            /* keeping the last page from the middle section to restore it
               also shrinking this section when user clicks on a page keeping minimum size of 3 */
            for(let x = selectedPage <= size-2? selectedPage-1: size-2;x<=size;x++) {
                array.push(x);
            }
            rightArray.value = array
            middleArray.value = [] // no need of middle section when right section is active
        }
    };

    // function to perform 2 tasks - load the correct page and change the pagination component
    const onClickHandler = (item) => {
        props.loadPosts(item)
        calculateSpan(item)
    }
</script>

<style lang="scss" scoped>
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