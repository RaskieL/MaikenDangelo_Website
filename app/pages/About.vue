<template>
	<div
		class="flex flex-col lg:flex-row gap-10 p-10 text-[1.2rem] bg-(--p-primary-background-color) w-full h-[80vh] lg:h-min lg:w-[60%] rounded-xl backdrop-blur-sm justify-center">
		<div class="flex flex-col gap-5 items-center justify-center w-full">
			<Image src="/unnamed.jpg" image-class="rounded-xl w-[100%]" />
			<p>星々と永遠へ</p>
		</div>
		<div class="flex flex-col gap-5 overflow-y-scroll">
			<h2>À propos de moi</h2>
			<p>
				Je m'appelle Maïken D'Angelo, originaire du Périgord et agée de 22 ans, je suis étudiante en troisième
				année de BUT Informatique à Belfort. <br /><br />
				Spécialisée dans le développement d'application fullstack, enthousiaste DevOps et meneuse d'équipe
				occasionnelle, j'aspire à ce que mes solutions numériques soient pérennes.
				<br /><br />
				Passionnée par les jeux vidéos et les mondes virtuels, mon ambition est de devenir Technical Artist.
			</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
	useHead({
		title: "À propos",
	});
</script>
