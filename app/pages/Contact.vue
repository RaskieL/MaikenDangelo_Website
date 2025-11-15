<template>
	<div class="flex flex-row gap-10 p-10 text-[1.2rem] bg-[rgba(0,0,0,0.6)] w-[50vw] rounded-xl backdrop-blur-sm items-center">
		<div class="flex flex-col gap-5 items-center justify-center w-[50%]">
			<Image src="/unnamed.jpg" image-class="rounded-xl w-[512px]"/>
			<p>星々と永遠へ</p>
		</div>
		<div class="flex flex-col gap-5">
			<h3>Coordonnées</h3>
			<p><b>Téléphone :</b> 07 83 85 78 60</p>
			<p><b>E-Mail :</b> maiken.dangelo@gmail.com</p>
			<h3 class="text-[1.5rem]">Formulaire de contact</h3>
			<form class="flex flex-col gap-5" method="post" @submit.prevent="(event) => submitContactForm(event)">
				<div class="grid grid-cols-2 gap-5">
					<FloatLabel variant="on">
						<InputText id="name" type="text" required />
						<label class="text-md" for="name" required>Nom</label>
					</FloatLabel>

					<FloatLabel variant="on">
						<InputText id="firstname" type="text" required />
						<label for="firstname">Prénom</label>
					</FloatLabel>
				</div>

				<FloatLabel variant="on">
					<InputText id="email" class="w-full" type="email" required />
					<label for="email">E-Mail</label>
				</FloatLabel>

				<FloatLabel variant="on">
					<InputText id="object" class="w-full" type="text" required />
					<label for="object">Objet</label>
				</FloatLabel>

				<FloatLabel variant="on">
					<TextArea id="message" class="w-full h-40" type="text" required />
					<label for="message">Message</label>
				</FloatLabel>

				<Button type="submit" label="Envoyer" />
			</form>
		</div>
	</div>
</template>

<script lang="ts" setup>
	useHead({
		title: "Contact",
	});

	function submitContactForm(event: SubmitEvent) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const form = event.target as any;
		if (!form) return;
		console.log(form.elements.name.value);
		console.log(form.elements.firstname.value);
		console.log(form.elements.email.value);
		console.log(form.elements.object.value);
		console.log(form.elements.message.value);
	}
</script>
