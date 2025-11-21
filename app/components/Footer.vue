<template>
	<div
		class="grid grid-cols-3 w-full min-h-[5vh] top-[100vh] text-center p-4 bg-(--p-primary-background-color) backdrop-blur-sm">
		<div class="flex flex-col gap-2">
			<h3>Comptes Git</h3>
			<a target="_blank" href="https://github.com/RaskieL">RaskieL</a>
			<a target="_blank" href="https://gitlab.com/RaskieL">RaskieL (Gitlab)</a>
			<a target="_blank" href="https://github.com/MaikenDANGELO">MaikenDANGELO</a>
		</div>
		<div class="flex flex-col gap-5 items-center justify-center">
			<p class="">© {{ year }} Maïken D'Angelo</p>
			<Image id="seal" src="/footer-azarashi.png" image-class="rounded-2xl" @click.stop="playSealAudio" />
		</div>
		<div class="flex flex-col gap-2 items-center">
			<h3>Réseaux sociaux</h3>
			<div class="grid grid-cols-2 items-center w-1/2">
				<i class="pi pi-at" />
				<a class="text-left" target="_blank" href="mailto:maiken.dangelo@gmail.com">maiken.dangelo@gmail.com</a>
			</div>
			<div class="grid grid-cols-2 items-center w-1/2">
				<i class="pi pi-linkedin" />
				<a class="text-left" target="_blank" href="https://www.linkedin.com/in/ma%C3%AFken-d-angelo"
					>Maïken D'Angelo</a
				>
			</div>
			<div class="grid grid-cols-2 items-center w-1/2">
				<i class="pi pi-discord" />
				<a class="text-left" target="_blank" href="https://discord.com/users/444074251079778314">Maïken</a>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	const year = ref(new Date().getFullYear());

	const audioFiles: string[] = [];

	onMounted(() => {
		for (let i = 1; i <= 12; i++) {
			audioFiles.push(`seal${i}.mp3`);
		}
	});

	async function playSealAudio() {
		const audioPath = audioFiles[Math.floor(Math.random() * audioFiles.length)];
		const sealAudio = new Audio(`/audio/${audioPath}`);

		await sealAudio.play();
	}
</script>

<style scoped>
#seal:hover{
	cursor: pointer;
	transform: scale(1.1);
	transition: 0.1s linear;
}

#seal {
	transition: 0.1s linear;
}
</style>
