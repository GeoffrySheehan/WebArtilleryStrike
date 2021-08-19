<template>
	<RenameableButton :value="`Location ${itemid}`" @click="onClick" />
</template>

<script>
import RenameableButton from './RenamableButton';

export default {
	name: 'LocationButton',
	props: {
		itemid: Number,
		// location: {
		// 	distance: {
		// 		type: Number,
		// 		default: 1.0,
		// 	},
		// 	asimuth: {
		// 		type: Number,
		// 		default: 0.0,
		// 	},
		// 	default: {
		// 		type: Boolean,
		// 		default: false,
		// 	},
		// },
	},
	components: {
		RenameableButton,
	},
	methods: {
		onClick() {
			this.$emit('select-location', {
				id: this.itemid,
				location: { ...this.location },
				updateLocation: this.updateLocation,
			});
		},
		updateLocation(newLocation) {
			this.location = {
				...newLocation,
				default: false,
			};
		},
	},
	data() {
		return {
			location: {
				distance: 1.0,
				azimuth: 0.0,
				default: true,
			},
		};
	},
};
</script>
