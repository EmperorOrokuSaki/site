<script lang="ts">
	import { browser } from '$app/environment';

	const SPEED_THRESHOLD = 800;
	const TRAIL_COLORS = ['#ff3333', '#33ff33', '#ffff33'];
	const FADE_DURATION = 600;
	const MIN_DISTANCE = 4;

	let canvas: HTMLCanvasElement;

	interface Point {
		x: number;
		y: number;
		color: string;
		time: number;
	}

	let points: Point[] = [];
	let lastX = 0;
	let lastY = 0;
	let lastTime = 0;
	let colorIndex = 0;
	let animFrame = 0;

	function onMouseMove(e: MouseEvent) {
		const now = performance.now();
		const dt = now - lastTime;

		if (dt > 0 && lastTime > 0) {
			const dx = e.clientX - lastX;
			const dy = e.clientY - lastY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const speed = (dist / dt) * 1000;

			if (speed > SPEED_THRESHOLD && dist > MIN_DISTANCE) {
				points.push({
					x: e.clientX,
					y: e.clientY,
					color: TRAIL_COLORS[colorIndex % TRAIL_COLORS.length],
					time: now
				});
				colorIndex++;
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

		for (let i = 1; i < points.length; i++) {
			const prev = points[i - 1];
			const curr = points[i];

			if (curr.time - prev.time > 50) continue;

			const age = now - curr.time;
			const alpha = 1 - age / FADE_DURATION;

			ctx.beginPath();
			ctx.moveTo(prev.x, prev.y);
			ctx.lineTo(curr.x, curr.y);
			ctx.strokeStyle = curr.color;
			ctx.globalAlpha = Math.max(0, alpha);
			ctx.lineWidth = 2;
			ctx.lineCap = 'round';
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
