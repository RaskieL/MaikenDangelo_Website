<template>
	<div
		class="flex flex-col gap-[2%] bg-(--p-primary-background-color) rounded-2xl backdrop-blur-sm w-full h-[70vh] p-[2%] overflow-scroll">
		<div v-if="portfolioPages" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20">
			<div
				v-for="(page, key) in portfolioPages"
				:key="key"
				class="portfolio-card flex flex-col gap-[2%] justify-center items-center bg-[#0e1116e7] backdrop-blur-sm p-10 rounded-2xl w-fit">
				<h2 class="text-center">{{ page.title }}</h2>
				<div class="flex flex-row gap-10">
					<span class="flex flex-row gap-2 items-center">
						<h3>Début </h3>
						<p>{{ page.meta.dateStart }}</p>
					</span>
					<span class="flex flex-row gap-2 items-center">
						<h3>Fin </h3>
						<p>{{ page.meta.dateEnd }}</p>
					</span>
				</div>
				<Image :src="`/portfolio/${page.title}/${page.meta.image}`" class="h-[50%]" image-class="h-[100%]" />
				<p>{{ page.description }}</p>
				<div class="grid grid-cols-4 gap-2 overflow-x-scroll rounded-2xl h-[20%]">
					<div v-for="(tag, tkey) in page.meta.tags" :key="tkey">
						<Chip class="w-full">{{ tag }}</Chip>
					</div>
				</div>

				<div class="flex flex-row gap-5">
					<Button
						icon="pi pi-github"
						label="Repository"
						:disabled="!page.meta.repository"
						@click.stop="
							navigateTo(page.meta.repository!, { external: true, open: { target: '_blank' } })
						" />
					<Button icon="pi pi-eye" label="Lire plus" @click.stop="navigateTo(page.path)" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	useHead({
		title: "Portfolio",
	});

	const { data: portfolioPages } = await useAsyncData(
		"portfolio-query",
		async () => {
			const pages = await queryCollection("content").where("path", "LIKE", "%portfolio%").all();

			if (pages) {
				pages.sort((p1, p2) => {
					if (!p1.meta?.dateStart || !p2.meta?.dateStart) return 0;
					const p1D = (p1.meta.dateStart as string).split("/");
					const p2D = (p2.meta.dateStart as string).split("/");
					if (!p1D.at(1) || !p2D.at(1)) return 0;
					const date1 = new Date(Number.parseInt(p1D.at(1)!), Number.parseInt(p1D.at(0)!) - 1);
					const date2 = new Date(Number.parseInt(p2D.at(1)!), Number.parseInt(p2D.at(0)!) - 1);

					if (date1 > date2) return -1;
					else if (date1 < date2) return 1;
					else return 0;
				});
			}
			return pages;
		}
	);
</script>

<style scoped>
	.portfolio-card {
		transition: 0.1s linear;
	}

	.portfolio-card:hover {
		transition: 0.2s linear;
		transform: scale(1.01);
		box-shadow: 0px 0px 20px 5px #0370dd;
	}
</style>
