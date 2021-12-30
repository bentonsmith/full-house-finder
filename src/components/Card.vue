<template>
    <div class="ma-1">
        <img :src="url" :alt="value + 'of' + suit">
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        url: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        suit: {
            type: String,
            default: ''
        }
    }
}
</script>