<template>
	<input v-if="renaming" type="text" :value="name" @change="handleChange" />
	<button v-else @dblclick="toggleRename">{{ name }}</button>
</template>

<script>
export default {
	name: 'RenameableButton',
	props: {
		name: String,
		location: Object,
	},
	methods: {
		toggleRename() {
			this.renaming = !this.renaming;
		},
		handleChange(e) {
			console.log(e);
		},
	},
	data() {
		return {
			name: '',
			working: '',
			renaming: false,
		};
	},
};
</script>

<style scoped></style>
