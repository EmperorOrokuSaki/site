<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		art: string;
	}

	let { art }: Props = $props();

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
	let canvas: HTMLCanvasElement;
	let isHovering = $state(false);
	let isRendered = $state(false);

	onMount(() => {
		const timer = setTimeout(() => {
			isRendered = true;
		}, 100);

		const particles: Particle[] = [];
		let mousePos = { x: 0, y: 0 };
		let lastEmitTime = 0;
		let animationId: number;
		const chars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';

		function updateCanvasSize() {
			if (!container || !canvas) return;
			const rect = container.getBoundingClientRect();
			canvas.width = rect.width;
			canvas.height = rect.height;
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
			const ctx = canvas?.getContext('2d');
			if (!ctx) return;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
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
		container?.addEventListener('mousemove', handleMouseMove);
		animationId = requestAnimationFrame(animate);

		return () => {
			clearTimeout(timer);
			window.removeEventListener('resize', updateCanvasSize);
			container?.removeEventListener('mousemove', handleMouseMove);
			cancelAnimationFrame(animationId);
		};
	});
</script>

<div
	class="flex justify-center relative"
	bind:this={container}
	onmouseenter={() => (isHovering = true)}
	onmouseleave={() => (isHovering = false)}
	role="img"
	aria-label="ASCII art"
>
	<pre
		class="whitespace-pre overflow-x-auto max-h-[400px]"
		style="font-size: 4px; line-height: 1; contain: content; transform: translateZ(0); color: var(--ascii-color); user-select: none;"
		>{isRendered ? art : 'Loading ASCII art...'}</pre>
	<canvas bind:this={canvas} class="absolute pointer-events-none" style="z-index: 1;"></canvas>
</div>
