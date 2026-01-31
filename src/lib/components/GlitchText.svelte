<script lang="ts">
	interface Props {
		text: string;
		typingSpeed?: number;
		class?: string;
	}

	let { text, typingSpeed = 80, class: className = '' }: Props = $props();

	let displayedText = $state('');
	let isGlitching = $state(false);

	$effect(() => {
		let currentIndex = 0;
		let typingTimeout: ReturnType<typeof setTimeout>;
		let glitchTimeout: ReturnType<typeof setTimeout>;
		let glitchDuration: ReturnType<typeof setTimeout>;

		function typeNextChar() {
			if (currentIndex < text.length) {
				displayedText = text.slice(0, currentIndex + 1);
				currentIndex++;
				typingTimeout = setTimeout(typeNextChar, typingSpeed);
			}
		}

		function triggerGlitch() {
			if (Math.random() < 0.2) {
				isGlitching = true;
				glitchDuration = setTimeout(() => {
					isGlitching = false;
				}, Math.random() * 150 + 50);
			}
			glitchTimeout = setTimeout(triggerGlitch, Math.random() * 3000 + 2000);
		}

		typeNextChar();
		glitchTimeout = setTimeout(triggerGlitch, Math.random() * 1000 + 1000);

		return () => {
			clearTimeout(typingTimeout);
			clearTimeout(glitchTimeout);
			clearTimeout(glitchDuration);
		};
	});
</script>

<div class="glitch-container {className}">
	<span class="glitch-text" class:glitching={isGlitching} data-text={displayedText}>
		{displayedText}
	</span>
</div>

<style>
	@keyframes glitch-anim-1 {
		0% {
			clip-path: inset(40% 0 61% 0);
			transform: translate(-2px, 0);
		}
		20% {
			clip-path: inset(92% 0 1% 0);
			transform: translate(1px, 0);
		}
		40% {
			clip-path: inset(43% 0 1% 0);
			transform: translate(0, 1px);
		}
		60% {
			clip-path: inset(25% 0 58% 0);
			transform: translate(1px, -1px);
		}
		80% {
			clip-path: inset(54% 0 7% 0);
			transform: translate(-1px, 1px);
		}
		100% {
			clip-path: inset(58% 0 43% 0);
			transform: translate(2px, 0);
		}
	}

	@keyframes glitch-anim-2 {
		0% {
			clip-path: inset(25% 0 58% 0);
			transform: translate(1px, -1px);
		}
		20% {
			clip-path: inset(54% 0 7% 0);
			transform: translate(-1px, 1px);
		}
		40% {
			clip-path: inset(58% 0 43% 0);
			transform: translate(2px, 0);
		}
		60% {
			clip-path: inset(40% 0 61% 0);
			transform: translate(-2px, 0);
		}
		80% {
			clip-path: inset(92% 0 1% 0);
			transform: translate(1px, 0);
		}
		100% {
			clip-path: inset(43% 0 1% 0);
			transform: translate(0, 1px);
		}
	}

	.glitch-container {
		position: relative;
		display: inline-block;
	}

	.glitch-text {
		position: relative;
		display: inline-block;
	}

	.glitch-text.glitching::before,
	.glitch-text.glitching::after {
		content: attr(data-text);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.8;
	}

	.glitch-text.glitching::before {
		color: #06b6d4;
		z-index: -1;
		animation: glitch-anim-1 0.2s linear infinite alternate-reverse;
	}

	:global(.light) .glitch-text.glitching::before {
		color: #3b82f6;
	}

	.glitch-text.glitching::after {
		color: #d946ef;
		z-index: -2;
		animation: glitch-anim-2 0.3s linear infinite alternate-reverse;
	}

	:global(.light) .glitch-text.glitching::after {
		color: #ef4444;
	}
</style>
