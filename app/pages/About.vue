<template>
	<div
		class="flex flex-row gap-10 p-10 text-[1.2rem] bg-[var(--p-primary-background-color)] w-[50vw] max-w-[50vw] rounded-xl backdrop-blur-sm">
		<div class="flex flex-col gap-5 items-center justify-center w-[50%]">
			<Image src="/unnamed.jpg" image-class="rounded-xl w-[512px]" />
			<p>星々と永遠へ</p>
		</div>
		<div class="flex flex-col gap-5 overflow-hidden">
			<h2>À propos de moi</h2>
			<p>
				Je m'appelle Maïken D'Angelo, originaire du Périgord et agée de 22 ans, je suis étudiante en troisième
				année de BUT Informatique à Belfort. <br /><br />
				Spécialisée dans le développement d'application fullstack, enthousiaste DevOps et meneuse d'équipe
				occasionnelle, j'aspire à ce que mes solutions numériques soient pérennes.
				<br /><br />
				Passionnée par les jeux vidéos et les mondes virtuels, mon ambition est de devenir Technical Artist.
			</p>
      <Button label="Me contacter" />
		</div>
	</div>
</template>

<script lang="ts" setup>
	useHead({
		title: "À propos",
	});
</script>
