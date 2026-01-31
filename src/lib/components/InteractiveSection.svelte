<script lang="ts">
	import { onMount } from 'svelte';
	import ScratchReveal from './ScratchReveal.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
		includeScratchReveal?: boolean;
		scratchText?: string;
	}

	let {
		children,
		class: className = '',
		includeScratchReveal = true,
		scratchText = 'answer the call of uncertainty'
	}: Props = $props();

	interface Particle {
		x: number;
		y: number;
		char: string;
		size: number;
		speedX: number;
		speedY: number;
		life: number;
		maxLife: number;
	}

	let container: HTMLDivElement;
	let particleCanvas: HTMLCanvasElement;
	let isHovering = $state(false);

	onMount(() => {
		if (!container || !particleCanvas) return;

		const particles: Particle[] = [];
		let mousePos = { x: 0, y: 0 };
		let lastEmitTime = 0;
		let animationId: number;
		const chars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';

		function updateCanvasSize() {
			const rect = container.getBoundingClientRect();
			particleCanvas.width = rect.width;
			particleCanvas.height = rect.height;
		}

		function handleMouseMove(e: MouseEvent) {
			const rect = container.getBoundingClientRect();
			mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
		}

		function emitParticles(timestamp: number) {
			if (timestamp - lastEmitTime < 50) return;
			lastEmitTime = timestamp;

			if (isHovering) {
				for (let i = 0; i < 3; i++) {
					const angle = Math.random() * Math.PI * 2;
					const distance = Math.random() * 10;
					particles.push({
						x: mousePos.x + Math.cos(angle) * distance,
						y: mousePos.y + Math.sin(angle) * distance,
						char: chars[Math.floor(Math.random() * chars.length)],
						size: 8 + Math.random() * 4,
						speedX: (Math.random() - 0.5) * 2,
						speedY: (Math.random() - 0.5) * 2,
						life: 0,
						maxLife: 30 + Math.random() * 30
					});
				}
			}
		}

		function animate(timestamp: number) {
			const ctx = particleCanvas.getContext('2d');
			if (!ctx) return;

			ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
			const asciiColor =
				getComputedStyle(document.documentElement).getPropertyValue('--ascii-color').trim() ||
				'#22c55e';

			emitParticles(timestamp);

			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				p.x += p.speedX;
				p.y += p.speedY;
				p.life++;

				const opacity = 1 - p.life / p.maxLife;
				ctx.font = `${p.size}px monospace`;
				ctx.fillStyle = `${asciiColor}${Math.round(opacity * 255)
					.toString(16)
					.padStart(2, '0')}`;
				ctx.fillText(p.char, p.x, p.y);

				if (p.life >= p.maxLife) {
					particles.splice(i, 1);
				}
			}

			animationId = requestAnimationFrame(animate);
		}

		updateCanvasSize();
		window.addEventListener('resize', updateCanvasSize);
		container.addEventListener('mousemove', handleMouseMove);
		animationId = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener('resize', updateCanvasSize);
			container.removeEventListener('mousemove', handleMouseMove);
			cancelAnimationFrame(animationId);
		};
	});
</script>

<div
	class="relative {className}"
	bind:this={container}
	style="cursor: none;"
	onmouseenter={() => (isHovering = true)}
	onmouseleave={() => (isHovering = false)}
	role="region"
>
	{@render children()}

	{#if includeScratchReveal}
		<ScratchReveal text={scratchText} />
	{/if}

	<canvas
		bind:this={particleCanvas}
		class="absolute top-0 left-0 w-full h-full pointer-events-none"
		style="z-index: 1;"
	></canvas>
</div>
