// Small client for the hamotazky.cz question bank API.
// https://hamotazky.cz/api/v1/docs/
//
// Everything that knows about the API's response shape lives here, so the
// widget only works with the normalized objects below.

const API_BASE = 'https://hamotazky.cz/api/v1'
const WEB_BASE = 'https://hamotazky.cz'

export const LICENCE_CLASSES = ['A', 'N']
export const DEFAULT_LICENCE = 'A'

// The API returns at most 100 questions per request.
const MAX_QUESTIONS = 100

// In-memory caches of pending/settled promises, shared by all widgets on the
// page (and across client-side navigation), so each resource is fetched once.
let topicsPromise = null
const questionCache = new Map()

async function getJson(path, params = {}) {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${API_BASE}${path}${query ? `?${query}` : ''}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    // Errors come as { error, status }; fall back to the status code.
    const body = await res.json().catch(() => null)
    throw new Error(`hamotazky API ${res.status} for ${path}: ${body?.error ?? res.statusText}`)
  }
  return res.json()
}

/**
 * All topics, keyed by topic ID. Questions only carry a topicId, so this is
 * used to show the topic name and link.
 * @returns {Promise<Map<string, {id: string, slug: string, name: string}>>}
 */
function getTopics() {
  if (!topicsPromise) {
    topicsPromise = getJson('/topics')
      .then((data) => new Map(data.map((t) => [
        String(t.topicId),
        { id: String(t.topicId), slug: t.topicSlug, name: t.name },
      ])))
      .catch((err) => { topicsPromise = null; throw err })
  }
  return topicsPromise
}

/**
 * @returns {{id: string, text: string, topic: {id, slug, name} | null,
 *   answers: Array<{id: string, text: string, correct: boolean}>}}
 */
function normalizeQuestion(q, topics) {
  return {
    id: String(q.questionId),
    text: q.text,
    topic: topics.get(String(q.topicId)) ?? null,
    answers: q.answers.map((a) => ({
      id: String(a.answerId),
      text: a.text,
      correct: Boolean(a.isCorrect),
    })),
  }
}

/**
 * A random selection (up to 100) of questions from the given topic slugs and
 * licence class. Without slugs, questions from all topics are used.
 */
export async function getRandomQuestions(slugs, licence) {
  const params = { licenceClass: licence, count: MAX_QUESTIONS }
  if (slugs.length) params.topicSlug = slugs.join(',')
  const [data, topics] = await Promise.all([getJson('/random-questions', params), getTopics()])
  return data.map((q) => normalizeQuestion(q, topics))
}

/** One question by its ID (the "Otázka č." number shown in the widget). */
export function getQuestion(id) {
  const key = String(id)
  if (!questionCache.has(key)) {
    const load = Promise.all([getJson(`/questions/${encodeURIComponent(key)}`), getTopics()])
      .then(([data, topics]) => normalizeQuestion(data[0], topics))
      .catch((err) => { questionCache.delete(key); throw err })
    questionCache.set(key, load)
  }
  return questionCache.get(key)
}

/** Link to a topic in the hamotazky.cz question browser (or its home page). */
export function topicBrowseUrl(slug, licence) {
  if (!slug) return WEB_BASE
  const section = licence === 'N' ? 'novice' : 'harec'
  return `${WEB_BASE}/${section}/prohlizeni/${slug}`
}
