<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		text?: string;
		class?: string;
	}

	let { text = 'answer the call of uncertainty', class: className = '' }: Props = $props();

	interface RevealedWord {
		text: string;
		x: number;
		y: number;
		life: number;
		maxLife: number;
		glitchIntensity: number;
		offsetX: number;
		offsetY: number;
		rgbShift: number;
		isGlitching: boolean;
	}

	let canvas: HTMLCanvasElement;
	const words = text.split(' ');

	onMount(() => {
		if (!canvas) return;

		const revealedWords: RevealedWord[] = [];
		const scratchedAreas = new Set<string>();
		let isScratching = false;
		let lastPos = { x: 0, y: 0 };
		let frameCount = 0;
		let animationId: number | null = null;

		function updateCanvasSize() {
			const parent = canvas.parentElement;
			if (!parent) return;
			const { width, height } = parent.getBoundingClientRect();
			canvas.width = width;
			canvas.height = height;
		}

		function startAnimation() {
			if (animationId === null) {
				animationId = requestAnimationFrame(animateLoop);
			}
		}

		function revealWordAtPosition(x: number, y: number) {
			const cellSize = 50;
			const cellId = `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;
			if (scratchedAreas.has(cellId)) return;
			scratchedAreas.add(cellId);

			const wordIndex = revealedWords.length % words.length;
			revealedWords.push({
				text: words[wordIndex],
				x,
				y,
				life: 0,
				maxLife: 90,
				glitchIntensity: 0,
				offsetX: 0,
				offsetY: 0,
				rgbShift: 0,
				isGlitching: false
			});
			startAnimation();
		}

		function handleStart(x: number, y: number) {
			isScratching = true;
			lastPos = { x, y };
			revealWordAtPosition(x, y);
		}

		function handleMove(x: number, y: number) {
			if (!isScratching) return;
			const dx = x - lastPos.x;
			const dy = y - lastPos.y;
			if (Math.sqrt(dx * dx + dy * dy) > 30) {
				revealWordAtPosition(x, y);
				lastPos = { x, y };
			}
		}

		function handleEnd() {
			isScratching = false;
		}

		function onMouseDown(e: MouseEvent) {
			const rect = canvas.getBoundingClientRect();
			handleStart(e.clientX - rect.left, e.clientY - rect.top);
		}

		function onMouseMove(e: MouseEvent) {
			const rect = canvas.getBoundingClientRect();
			handleMove(e.clientX - rect.left, e.clientY - rect.top);
		}

		function onTouchStart(e: TouchEvent) {
			e.preventDefault();
			const rect = canvas.getBoundingClientRect();
			const touch = e.touches[0];
			handleStart(touch.clientX - rect.left, touch.clientY - rect.top);
		}

		function onTouchMove(e: TouchEvent) {
			e.preventDefault();
			const rect = canvas.getBoundingClientRect();
			const touch = e.touches[0];
			handleMove(touch.clientX - rect.left, touch.clientY - rect.top);
		}

		function drawWords(ctx: CanvasRenderingContext2D) {
			const asciiColor =
				getComputedStyle(document.documentElement).getPropertyValue('--ascii-color').trim() ||
				'#4ade80';
			let r = 0,
				g = 0,
				b = 0;
			if (asciiColor.startsWith('#')) {
				const hex = asciiColor.substring(1);
				r = parseInt(hex.substring(0, 2), 16);
				g = parseInt(hex.substring(2, 4), 16);
				b = parseInt(hex.substring(4, 6), 16);
			}

			for (let i = revealedWords.length - 1; i >= 0; i--) {
				const w = revealedWords[i];
				w.life++;
				const phase = w.life / w.maxLife;

				let opacity: number;
				if (phase < 0.2) {
					opacity = phase * 5;
				} else if (phase < 0.7) {
					opacity = 1;
					if (Math.random() < 0.05) {
						w.isGlitching = true;
						w.glitchIntensity = Math.random() * 0.5;
						w.offsetX = (Math.random() - 0.5) * 10;
						w.offsetY = (Math.random() - 0.5) * 5;
						w.rgbShift = Math.random() * 5;
					} else if (w.isGlitching && Math.random() < 0.3) {
						w.isGlitching = false;
						w.offsetX = 0;
						w.offsetY = 0;
						w.rgbShift = 0;
					}
				} else {
					opacity = 1 - (phase - 0.7) / 0.3;
					if (frameCount % 3 === 0) {
						w.isGlitching = true;
						w.glitchIntensity = Math.min(1, w.glitchIntensity + 0.1);
						w.offsetX = (Math.random() - 0.5) * 15 * w.glitchIntensity;
						w.offsetY = (Math.random() - 0.5) * 8 * w.glitchIntensity;
						w.rgbShift = Math.random() * 8 * w.glitchIntensity;
					}
				}

				ctx.font = 'bold 16px monospace';
				if (w.isGlitching) {
					const baseX = w.x + w.offsetX;
					const baseY = w.y + w.offsetY;
					ctx.fillStyle = `rgba(${r}, 0, 0, ${opacity * 0.8})`;
					ctx.fillText(w.text, baseX - w.rgbShift, baseY);
					ctx.fillStyle = `rgba(0, ${g}, 0, ${opacity * 0.8})`;
					ctx.fillText(w.text, baseX, baseY + w.rgbShift * 0.5);
					ctx.fillStyle = `rgba(0, 0, ${b}, ${opacity * 0.8})`;
					ctx.fillText(w.text, baseX + w.rgbShift, baseY);
				} else {
					ctx.fillStyle =
						asciiColor +
						Math.floor(opacity * 255)
							.toString(16)
							.padStart(2, '0');
					ctx.fillText(w.text, w.x, w.y);
				}

				if (w.life >= w.maxLife) {
					revealedWords.splice(i, 1);
				}
			}
		}

		function animateLoop() {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				frameCount++;
				drawWords(ctx);
			}

			// Only keep animating if there are active words
			if (revealedWords.length > 0) {
				animationId = requestAnimationFrame(animateLoop);
			} else {
				animationId = null;
			}
		}

		updateCanvasSize();
		window.addEventListener('resize', updateCanvasSize);
		canvas.addEventListener('mousedown', onMouseDown);
		canvas.addEventListener('mousemove', onMouseMove);
		canvas.addEventListener('mouseup', handleEnd);
		canvas.addEventListener('mouseleave', handleEnd);
		canvas.addEventListener('touchstart', onTouchStart, { passive: false });
		canvas.addEventListener('touchmove', onTouchMove, { passive: false });
		canvas.addEventListener('touchend', handleEnd);

		return () => {
			window.removeEventListener('resize', updateCanvasSize);
			canvas.removeEventListener('mousedown', onMouseDown);
			canvas.removeEventListener('mousemove', onMouseMove);
			canvas.removeEventListener('mouseup', handleEnd);
			canvas.removeEventListener('mouseleave', handleEnd);
			canvas.removeEventListener('touchstart', onTouchStart);
			canvas.removeEventListener('touchmove', onTouchMove);
			canvas.removeEventListener('touchend', handleEnd);
			if (animationId !== null) cancelAnimationFrame(animationId);
		};
	});
</script>

<div class="absolute inset-0 {className}">
	<canvas bind:this={canvas} class="w-full h-full" style="touch-action: none;"></canvas>
</div>
