<template>
	<div
		class="flex flex-col gap-5 bg-(--p-primary-background-color) rounded-2xl backdrop-blur-sm w-full h-[80%] mt-50 p-10 mr-10 ml-10 overflow-scroll">
		<ContentRenderer v-if="portfolioPage" :value="portfolioPage" />
		<div v-else>Contenu introuvable, veuillez revenir plus tard.</div>
	</div>
</template>

<script lang="ts" setup>
	import { useRoute } from "vue-router";

	const route = useRoute();
	const param = route.params.id;
	const portfolioPage = ref();
	if (param) {
		const { data: page } = await useAsyncData(async () => {
			return (await queryCollection("content").where("path", "LIKE", "%portfolio%").all()).find((page) => page.path === `/portfolio/${param}`);
		});
		portfolioPage.value = page.value;
	}
</script>
