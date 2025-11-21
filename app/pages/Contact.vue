<template>
	<div
		class="flex flex-col lg:flex-row gap-10 p-10 text-[1.2rem] bg-(--p-primary-background-color) w-full h-[80vh] lg:h-fit rounded-xl backdrop-blur-sm overflow-y-scroll">
		<div class="flex flex-col gap-5 w-full lg:w-[50%]">
			<h2>Coordonnées</h2>
			<div class="flex flex-row gap-5 items-center bg-[#0E1116] p-5 rounded-2xl">
				<i class="pi pi-map-marker" />
				<p>Belfort, Lyon, Avignon</p>
			</div>
			<div class="flex flex-row gap-5 items-center bg-[#0E1116] p-5 rounded-2xl">
				<i class="pi pi-phone" />
				<p>07 83 85 78 60</p>
			</div>
			<div class="flex flex-row gap-5 items-center bg-[#0E1116] p-5 rounded-2xl">
				<i class="pi pi-at" />
				<a target="_blank" href="mailto:maiken.dangelo@gmail.com">maiken.dangelo@gmail.com</a>
			</div>
			<div class="flex flex-row gap-5 items-center bg-[#0E1116] p-5 rounded-2xl">
				<i class="pi pi-github" />
				<p>
					<a target="_blank" href="https://github.com/RaskieL">RaskieL</a>,
					<a target="_blank" href="https://gitlab.com/RaskieL">RaskieL (Gitlab)</a>,
					<a target="_blank" href="https://github.com/MaikenDANGELO">MaikenDANGELO</a>
				</p>
			</div>
			<div class="flex flex-row gap-5 items-center bg-[#0E1116] p-5 rounded-2xl">
				<i class="pi pi-linkedin" />
				<a target="_blank" href="https://www.linkedin.com/in/ma%C3%AFken-d-angelo">Maïken D'ANGELO</a>
			</div>
			<div class="flex flex-row gap-5 items-center bg-[#0E1116] p-5 rounded-2xl">
				<i class="pi pi-discord" />
				<a target="_blank" href="https://discord.com/users/444074251079778314">Maïken</a>
			</div>
		</div>
		<div class="flex flex-col gap-5">
			<div class="flex flex-row gap-2 items-center">
				<h2>Formulaire de contact</h2>
				(non implémenté)
			</div>
			<form class="flex flex-col gap-5" method="post" @submit.prevent="(event) => submitContactForm(event)">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
					<FloatLabel variant="on">
						<InputText
							id="name"
							v-model="firstName"
							type="text"
							class="w-full"
							:invalid="firstName.length <= 0"
							required />
						<label class="text-md" for="name" required>Nom</label>
					</FloatLabel>

					<FloatLabel variant="on">
						<InputText
							id="firstname"
							v-model="name"
							type="text"
							class="w-full"
							:invalid="name.length <= 0"
							required />
						<label for="firstname">Prénom</label>
					</FloatLabel>
				</div>

				<FloatLabel variant="on">
					<InputText
						id="email"
						v-model="email"
						class="w-full"
						type="email"
						:invalid="email.length <= 0"
						required />
					<label for="email">E-Mail</label>
				</FloatLabel>

				<FloatLabel variant="on">
					<InputText
						id="object"
						v-model="object"
						class="w-full"
						type="text"
						:invalid="object.length <= 0"
						required />
					<label for="object">Objet</label>
				</FloatLabel>

				<FloatLabel variant="on">
					<TextArea
						id="message"
						v-model="message"
						class="w-full h-60"
						type="text"
						:invalid="message.length <= 0"
						required />
					<label for="message">Message</label>
				</FloatLabel>

				<div class="grid grid-cols-2 gap-30 items-center w-full">
					<Button
						type="submit"
						icon="pi pi-send"
						:pt="{
							label: { class: 'hidden md:block' },
						}"
						label="Envoyer"
						:disabled="!isHuman" />
					<div class="flex flex-row gap-2 bg-[#0E1116] p-3 items-center justify-end rounded-xl">
						<Checkbox
							v-model="isHuman"
							binary
							:disabled="
								firstName.length <= 0 ||
								name.length <= 0 ||
								email.length <= 0 ||
								object.length <= 0 ||
								message.length <= 0
							" />
						<p>Je suis humain</p>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts" setup>
	useHead({
		title: "Contact",
	});

	const isHuman = ref(false as boolean);

	const firstName = ref("");
	const name = ref("");
	const email = ref("");
	const object = ref("");
	const message = ref("");

	function submitContactForm(event: SubmitEvent) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const form = event.target as any;
		if (!form) return;
		console.log(form.elements.name.value);
		console.log(form.elements.firstname.value);
		console.log(form.elements.email.value);
		console.log(form.elements.object.value);
		console.log(form.elements.message.value);

		firstName.value = "";
		name.value = "";
		email.value = "";
		object.value = "";
		message.value = "";

		isHuman.value = false;
	}
</script>
