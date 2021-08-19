<template>
	<LocationButton
		v-for="buttonId in buttons"
		:class="[button.id - 1 === buttonId ? 'selected' : '']"
		@select-location="selectButton"
		:itemid="buttonId + 1"
		:key="buttonId"
		:ref="`lb${buttonId}`"
	/>
	<label for="distance">Distance: </label>
	<input
		type="number"
		name="distance"
		min="1"
		step="1"
		:value="this.location.distance"
		@input="updateDistance"
	/>
	<label for="azimuth">Azimuth: </label>
	<input
		type="number"
		name="azimuth"
		min="0"
		max="359"
		step="1"
		:value="this.location.azimuth"
		@input="updateAzimuth"
	/>
	<label>
		Distance: {{ this.location.distance }} Azimuth:
		{{ this.location.azimuth }}
	</label>
</template>

<script>
import LocationButton from './components/LocationButton';

export default {
	name: 'App',
	props: {
		value: '',
	},
	components: {
		LocationButton,
	},
	methods: {
		selectButton(button) {
			this.button = button;
			this.location = {
				distance: button.location.distance,
				azimuth: button.location.azimuth,
			};
		},
		updateDistance(e) {
			const distance = e.target.value;
			const newLocation = { ...this.location, distance };
			this.location = newLocation;
			this.button.updateLocation(newLocation);
		},
		updateAzimuth(e) {
			const azimuth = e.target.value;
			const newLocation = { ...this.location, azimuth };
			this.location = newLocation;
			this.button.updateLocation(newLocation);
		},
	},
	data() {
		return {
			location: {
				distance: 0.0,
				azimuth: 0.0,
			},
			button: 0,
			buttons: Array.from(Array(6).keys()),
		};
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}

.selected {
	background-color: yellow;
}
</style>
