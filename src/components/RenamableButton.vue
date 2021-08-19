<template>
	<input
		type="text"
		v-if="renaming"
		:value="name"
		@input="handleChange"
		@blur="applyChanges"
		@focus="$event.target.select()"
		ref="input"
	/>
	<button v-else @dblclick="toggleRename">{{ name }}</button>
</template>

<script>
export default {
	name: 'RenameableButton',
	props: {
		value: String,
	},
	methods: {
		toggleRename() {
			this.renaming = true;
			this.$nextTick(() => this.$refs.input.focus());
		},
		handleChange(e) {
			const newText = e.target.value;
			this.working = newText.trim();
		},
		applyChanges() {
			console.log('blurring');
			this.name = this.working || this.name;
			this.working = '';
			this.renaming = false;
		},
	},
	data() {
		return {
			name: this.value,
			working: '',
			renaming: false,
		};
	},
};
</script>

<style scoped>
input,
button {
	width: 300px;
}
</style>
