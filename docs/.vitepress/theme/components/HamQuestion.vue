<script setup>
// Interactive exam question box backed by the hamotazky.cz question bank.
//
// Usage in markdown:
//   <HamQuestion topic="q-kody" />
//   <HamQuestion topic="zkratky,q-kody" licence="N" />
//   <HamQuestion question="669" />
//
// Props:
//   topic    – topic slug(s) from hamotazky.cz, comma separated to mix topics;
//              when omitted, questions come from the whole question bank
//   licence  – licence class "A" (HAREC, default) or "N" (NOVICE)
//   question – optional question number ("Otázka č." shown in the box); shows
//              only that one question, without previous/next navigation

import { computed, onMounted, ref, watch } from 'vue'
import { DEFAULT_LICENCE, LICENCE_CLASSES, getQuestion, getRandomQuestions, topicBrowseUrl } from '../api/hamotazky.js'

const props = defineProps({
  topic: { type: String, default: '' },
  licence: {
    type: String,
    default: DEFAULT_LICENCE,
    validator: (v) => LICENCE_CLASSES.includes(String(v).toUpperCase()),
  },
  question: { type: [String, Number], default: null },
})

const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f']

const licenceClass = computed(() => String(props.licence).toUpperCase())
const slugs = computed(() => props.topic.split(',').map((s) => s.trim()).filter(Boolean))
const single = computed(() => props.question !== null && String(props.question).trim() !== '')

const status = ref('loading') // 'loading' | 'ready' | 'error'

// Questions shown so far, each with its answer order and the user's pick,
// so "previous" can go back and show it exactly as it was left.
const history = ref([]) // [{ question, answers, selectedId }]
const position = ref(-1)

let pool = []
let queue = []

const entry = computed(() => history.value[position.value] ?? null)
const question = computed(() => entry.value?.question ?? null)
const answers = computed(() => entry.value?.answers ?? [])
const selectedId = computed(() => entry.value?.selectedId ?? null)
const hasPrevious = computed(() => position.value > 0)

const answered = computed(() => selectedId.value !== null)
const currentTopic = computed(() => question.value?.topic ?? null)
const browseUrl = computed(() => topicBrowseUrl(currentTopic.value?.slug ?? slugs.value[0], licenceClass.value))

function shuffle(items) {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Walk through the pool in random order so questions don't repeat until all
// have been shown; then reshuffle, avoiding the question just displayed.
function drawQuestion() {
  if (!queue.length) {
    queue = shuffle(pool)
    if (queue.length > 1 && queue[queue.length - 1] === question.value) queue.unshift(queue.pop())
  }
  return queue.pop()
}

// After going back, "next" first steps forward through already seen
// questions; only at the end of the history is a new question drawn.
function nextQuestion() {
  if (!pool.length) return
  if (position.value < history.value.length - 1) {
    position.value++
    return
  }
  const q = drawQuestion()
  history.value.push({ question: q, answers: shuffle(q.answers), selectedId: null })
  position.value = history.value.length - 1
}

function previousQuestion() {
  if (hasPrevious.value) position.value--
}

// First click answers the question. Once answered, clicking the correct
// (highlighted) answer again moves on to the next question (except in
// single-question mode, where there is nowhere to go).
function select(answer) {
  if (!answered.value) {
    entry.value.selectedId = answer.id
  } else if (answer.correct && !single.value) {
    nextQuestion()
  }
}

function isLocked(answer) {
  return answered.value && (single.value || !answer.correct)
}

function answerState(answer) {
  if (!answered.value) return ''
  // After a wrong pick, the correct row is revealed only once the red one has settled.
  if (answer.correct) return answer.id === selectedId.value ? 'correct' : 'correct reveal-late'
  if (answer.id === selectedId.value) return 'wrong'
  return 'dimmed'
}

async function load() {
  status.value = 'loading'
  try {
    queue = []
    history.value = []
    position.value = -1
    if (single.value) {
      pool = [await getQuestion(String(props.question).trim())]
    } else {
      pool = await getRandomQuestions(slugs.value, licenceClass.value)
      if (!pool.length) throw new Error('No questions in selected topics')
    }
    nextQuestion()
    status.value = 'ready'
  } catch (err) {
    console.error('[HamQuestion]', err)
    status.value = 'error'
  }
}

// Fetch only in the browser; during the static build the loading placeholder is rendered.
onMounted(load)
watch(() => [props.topic, props.licence, props.question], load)
</script>

<template>
  <section class="ham-question" :aria-busy="status === 'loading'">
    <!-- Old content fades out, then the new one fades in (loading → question, and between questions). -->
    <Transition name="hq-swap" mode="out-in">
      <div v-if="status === 'loading'" class="hq-placeholder">
        <div class="hq-skeleton hq-skeleton-text" />
        <div v-for="n in 3" :key="n" class="hq-skeleton hq-skeleton-answer" />
      </div>

      <div v-else-if="status === 'error'" class="hq-error">
        <p>Otázku se nepodařilo načíst.</p>
        <div class="hq-actions">
          <button type="button" class="hq-button" @click="load">Zkusit znovu</button>
          <a class="hq-link" :href="browseUrl" target="_blank" rel="noopener">Otevřít otázky na hamotazky.cz ↗</a>
        </div>
      </div>

      <div v-else-if="question" :key="`q-${position}`" class="hq-body">
        <p class="hq-meta">
          Otázka č. {{ question.id }}
          <template v-if="currentTopic"> · <a class="hq-link" :href="browseUrl" target="_blank" rel="noopener">{{ currentTopic.name }} ↗</a></template>
        </p>
        <p class="hq-text">{{ question.text }}</p>

        <ul class="hq-answers">
          <li v-for="(answer, i) in answers" :key="answer.id">
            <button
              type="button"
              class="hq-answer"
              :class="answerState(answer)"
              :disabled="isLocked(answer)"
              :aria-pressed="answer.id === selectedId"
              :title="answered && answer.correct && !single ? 'Další otázka' : undefined"
              @click="select(answer)"
            >
              <span class="hq-letter">{{ LETTERS[i] }})</span>
              <span class="hq-answer-text">{{ answer.text }}</span>
              <span v-if="answered && answer.correct" class="hq-mark" aria-label="správná odpověď">✓</span>
              <span v-else-if="answerState(answer) === 'wrong'" class="hq-mark" aria-label="tvoje odpověď">✗</span>
            </button>
          </li>
        </ul>

        <footer v-if="!single" class="hq-footer">
          <button
            type="button"
            class="hq-button hq-button-secondary"
            :disabled="!hasPrevious"
            @click="previousQuestion"
          >← Předchozí</button>
          <button type="button" class="hq-button" @click="nextQuestion">Další otázka →</button>
        </footer>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.ham-question {
  margin: 24px 0;
  padding: 16px 20px 18px;
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}

.hq-meta {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.hq-text {
  margin: 4px 0 12px;
  font-weight: 500;
  line-height: 1.6;
}

.hq-answers {
  list-style: none;
  margin: 0;
  padding: 0;
}

.hq-answers li {
  margin: 0 0 8px;
}

.hq-answers li:last-child {
  margin-bottom: 0;
}

.hq-answer {
  display: flex;
  align-items: baseline;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 15px;
  line-height: 1.5;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.35s ease-out,
    background-color 0.35s ease-out,
    opacity 0.45s ease-out;
}

/* Hover only with a real pointer (touch screens keep :hover after a tap),
   and in neutral grey so it can't be mistaken for the green "correct" state. */
@media (hover: hover) {
  .hq-answer:not(:disabled):hover {
    border-color: var(--vp-c-text-3);
    background-color: var(--vp-c-bg-elv);
  }

  .hq-answer.correct:not(:disabled):hover {
    border-color: var(--vp-c-green-1);
    background-color: color-mix(in srgb, var(--vp-c-green-1) 24%, transparent);
  }
}

.hq-answer:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.hq-answer:disabled {
  cursor: default;
}

.hq-answer.correct {
  border-color: var(--vp-c-green-1);
  background-color: var(--vp-c-green-soft);
}

/* Correct row after a wrong pick: hold the neutral look while the wrong row
   turns red (0.35s), then turn green. Fill "backwards" only, so afterwards the
   normal rules (incl. hover) apply again. */
.hq-answer.reveal-late {
  animation: hq-reveal-correct 0.35s ease-out 0.35s backwards;
}

.hq-answer.reveal-late .hq-mark {
  animation-delay: 0.35s;
}

@keyframes hq-reveal-correct {
  from {
    border-color: var(--vp-c-divider);
    background-color: var(--vp-c-bg);
  }
}

.hq-answer.wrong {
  border-color: var(--vp-c-red-1);
  background-color: var(--vp-c-red-soft);
}

.hq-answer.dimmed {
  opacity: 0.6;
}

.hq-letter {
  flex: none;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.hq-answer-text {
  flex: 1;
}

.hq-mark {
  flex: none;
  animation: hq-mark-in 0.35s ease-out both;
  font-weight: 700;
}

.hq-answer.correct .hq-mark {
  color: var(--vp-c-green-1);
}

.hq-answer.wrong .hq-mark {
  color: var(--vp-c-red-1);
}

.hq-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 24px;
}

.hq-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.hq-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.hq-link:hover {
  text-decoration: underline;
}

.hq-button {
  padding: 6px 16px;
  border: 1px solid transparent;
  border-radius: 20px;
  background-color: var(--vp-c-brand-3);
  color: var(--vp-c-white);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.hq-button:not(:disabled):hover {
  background-color: var(--vp-c-brand-2);
}

.hq-button-secondary {
  border-color: var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.hq-button-secondary:not(:disabled):hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
}

.hq-button:disabled {
  opacity: 0.4;
  cursor: default;
}

.hq-error p {
  margin: 8px 0 12px;
  color: var(--vp-c-text-2);
}

.hq-skeleton {
  border-radius: 6px;
  background-color: var(--vp-c-default-soft);
  animation: hq-pulse 1.4s ease-in-out infinite;
}

.hq-skeleton-text {
  height: 22px;
  width: 75%;
  margin: 12px 0 16px;
}

.hq-skeleton-answer {
  height: 44px;
  margin-bottom: 8px;
}

@keyframes hq-mark-in {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: scale(1); }
}

.hq-swap-leave-active {
  transition: opacity 0.25s ease-in, transform 0.25s ease-in;
  /* the fading-out question must not take clicks meant for the new one */
  pointer-events: none;
}

.hq-swap-enter-active {
  transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}

.hq-swap-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.hq-swap-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

@keyframes hq-pulse {
  50% { opacity: 0.5; }
}

@media (prefers-reduced-motion: reduce) {
  .hq-skeleton { animation: none; }
  .hq-answer { transition: none; }
  .hq-mark,
  .hq-answer.reveal-late { animation: none; }
  .hq-swap-enter-active,
  .hq-swap-leave-active { transition: none; }
}
</style>
