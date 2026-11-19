// Small client for the hamotazky.cz question bank API.
// https://hamotazky.cz/api/v1/docs/
//
// Everything that knows about the API's response shape lives here, so the
// widget only works with the normalized objects below. When a dedicated
// single-question endpoint exists, only this file needs to change.

const API_BASE = 'https://hamotazky.cz/api/v1'
const WEB_BASE = 'https://hamotazky.cz'

export const LICENCE_CLASSES = ['A', 'N']
export const DEFAULT_LICENCE = 'A'

// In-memory caches of pending/settled promises, shared by all widgets on the
// page (and across client-side navigation), so each resource is fetched once.
const topicsCache = new Map()
const questionsCache = new Map()

async function getJson(path, params) {
  const url = `${API_BASE}${path}?${new URLSearchParams(params)}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`hamotazky API ${res.status} for ${path}`)
  return res.json()
}

function cached(cache, key, load) {
  if (!cache.has(key)) {
    // Drop failed requests from the cache so a retry can try again.
    cache.set(key, load().catch((err) => { cache.delete(key); throw err }))
  }
  return cache.get(key)
}

/** @returns {Promise<Array<{id: string, slug: string, name: string, questionCount: number}>>} */
export function getTopics(licence) {
  return cached(topicsCache, licence, async () => {
    const data = await getJson('/topics', { licenceClass: licence })
    return data.map((t) => ({
      id: String(t.topicId ?? t.id),
      slug: t.topicSlug,
      name: t.name,
      questionCount: t.questionCount,
    }))
  })
}

export async function getTopicBySlug(slug, licence) {
  const topics = await getTopics(licence)
  const topic = topics.find((t) => t.slug === slug)
  if (!topic) throw new Error(`Unknown topic "${slug}" for licence class ${licence}`)
  return topic
}

/**
 * @returns {Promise<Array<{id: string, code: string, text: string, topicSlug: string,
 *   answers: Array<{id: string, text: string, correct: boolean}>}>>}
 */
export function getQuestionsByTopic(topic, licence) {
  return cached(questionsCache, `${licence}:${topic.id}`, async () => {
    const data = await getJson('/questions-by-topic-id', { topicId: topic.id, licenceClass: licence })
    return (data.questions ?? data).map((q) => ({
      id: String(q.questionId ?? q.id),
      code: String(q.questionCode ?? q.code),
      text: q.text,
      topicSlug: topic.slug,
      answers: q.answers.map((a) => ({
        id: String(a.answerId ?? a.id),
        text: a.text,
        correct: Boolean(a.isCorrect),
      })),
    }))
  })
}

/** All questions from the given topic slugs, merged into one pool. */
export async function getQuestionPool(slugs, licence) {
  const topics = await Promise.all(slugs.map((s) => getTopicBySlug(s, licence)))
  const lists = await Promise.all(topics.map((t) => getQuestionsByTopic(t, licence)))
  return { topics, questions: lists.flat() }
}

/**
 * One question by its code (the "Otázka č." number), looked up in the given
 * topics. TODO: switch to a dedicated endpoint once the API offers one, so
 * the topic is no longer needed.
 */
export async function getQuestionByCode(code, slugs, licence) {
  const { topics, questions } = await getQuestionPool(slugs, licence)
  const question = questions.find((q) => q.code === String(code))
  if (!question) {
    throw new Error(`Question ${code} not found in topic(s) "${slugs.join(', ')}" for licence class ${licence}`)
  }
  return { topics, question }
}

/** Link to the topic in the hamotazky.cz question browser. */
export function topicBrowseUrl(slug, licence) {
  const section = licence === 'N' ? 'novice' : 'harec'
  return `${WEB_BASE}/${section}/prohlizeni/${slug}`
}
