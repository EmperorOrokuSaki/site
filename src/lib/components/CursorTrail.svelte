<script lang="ts">
	import { browser } from '$app/environment';

	const SPEED_THRESHOLD = 1120;
	const COLORS = ['#ff2233', '#ff6622', '#ffaa11', '#ffcc22', '#44dd33'];
	const FADE_DURATION = 800;
	const MIN_DISTANCE = 3;
	const STRIP_SPACING = 1.5;
	const MAX_WIDTH = 1.5;
	const MIN_WIDTH = 0.1;

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
		const halfColors = (COLORS.length - 1) / 2;

		// Draw each segment individually so width and alpha can vary
		for (let i = 1; i < len; i++) {
			const prev = points[i - 1];
			const curr = points[i];

			if (curr.time - prev.time > 50) continue;

			// Progress: 0 at tail, 1 at head
			const progress = i / (len - 1);
			const age = now - curr.time;
			const fade = 1 - age / FADE_DURATION;
			// Ease out the fade for smoother disappearance
			const alpha = fade * fade * progress;
			const width = MIN_WIDTH + progress * progress * (MAX_WIDTH - MIN_WIDTH);

			for (let c = 0; c < COLORS.length; c++) {
				const offset = (c - halfColors) * STRIP_SPACING;

				const x1 = prev.x + prev.nx * offset;
				const y1 = prev.y + prev.ny * offset;
				const x2 = curr.x + curr.nx * offset;
				const y2 = curr.y + curr.ny * offset;

				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.strokeStyle = COLORS[c];
				ctx.globalAlpha = Math.max(0, alpha);
				ctx.lineWidth = width;
				ctx.lineCap = 'round';
				ctx.stroke();
			}
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
