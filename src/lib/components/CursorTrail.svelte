<script lang="ts">
	import { browser } from '$app/environment';

	const SPEED_THRESHOLD = 800;
	const COLORS = ['#ff3333', '#33ff33', '#ffff33'];
	const FADE_DURATION = 600;
	const MIN_DISTANCE = 4;
	const STRIP_OFFSET = 4;
	const MAX_WIDTH = 3;

	let canvas: HTMLCanvasElement;

	interface Point {
		x: number;
		y: number;
		nx: number;
		ny: number;
		time: number;
	}

	let points: Point[] = [];
	let lastX = 0;
	let lastY = 0;
	let lastTime = 0;
	let animFrame = 0;

	function onMouseMove(e: MouseEvent) {
		// Skip when inside the interactive section (ASCII art area)
		const target = e.target as HTMLElement;
		if (target?.closest('[data-no-trail]')) return;

		const now = performance.now();
		const dt = now - lastTime;

		if (dt > 0 && lastTime > 0) {
			const dx = e.clientX - lastX;
			const dy = e.clientY - lastY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const speed = (dist / dt) * 1000;

			if (speed > SPEED_THRESHOLD && dist > MIN_DISTANCE) {
				// Normal perpendicular to movement direction
				const nx = -dy / dist;
				const ny = dx / dist;

				points.push({ x: e.clientX, y: e.clientY, nx, ny, time: now });
			}
		}

		lastX = e.clientX;
		lastY = e.clientY;
		lastTime = now;
	}

	function draw() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const now = performance.now();
		points = points.filter((p) => now - p.time < FADE_DURATION);

		if (points.length < 2) {
			animFrame = requestAnimationFrame(draw);
			return;
		}

		const len = points.length;

		for (let c = 0; c < COLORS.length; c++) {
			const offset = (c - 1) * STRIP_OFFSET;

			ctx.beginPath();
			ctx.strokeStyle = COLORS[c];
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			let started = false;

			for (let i = 0; i < len; i++) {
				const p = points[i];

				if (i > 0 && p.time - points[i - 1].time > 50) {
					// Gap in trail — start a new sub-path
					started = false;
					continue;
				}

				const ox = p.x + p.nx * offset;
				const oy = p.y + p.ny * offset;

				// Thinning: older points are thinner
				const progress = i / (len - 1);
				const age = now - p.time;
				const alpha = 1 - age / FADE_DURATION;

				ctx.globalAlpha = Math.max(0, alpha);
				ctx.lineWidth = Math.max(0.5, progress * MAX_WIDTH);

				if (!started) {
					ctx.moveTo(ox, oy);
					started = true;
				} else {
					ctx.lineTo(ox, oy);
				}
			}

			ctx.stroke();
		}

		ctx.globalAlpha = 1;
		animFrame = requestAnimationFrame(draw);
	}

	function resize() {
		if (!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	$effect(() => {
		if (!browser) return;

		resize();
		animFrame = requestAnimationFrame(draw);
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('resize', resize);

		return () => {
			cancelAnimationFrame(animFrame);
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="fixed inset-0 pointer-events-none"
	style="z-index: 9999;"
></canvas>
