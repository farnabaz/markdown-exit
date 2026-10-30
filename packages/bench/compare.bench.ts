import { it } from 'vitest'
import { createRunners } from './runners'

const fixtures = import.meta.glob<string>('./samples/*', { query: '?raw', import: 'default', eager: true })
const contents = Object.values(fixtures)

const runners = createRunners()

for (const [category, runnerGroup] of Object.entries(runners)) {
  it(`category: ${category}`, async ({ bench: b }) => {
    await b.compare(
      ...Object.entries(runnerGroup).map(([name, runner]) =>
        b(name, () => {
          for (const content of contents) {
            runner(content)
          }
        }),
      ),
      { time: 1000, warmupTime: 200 },
    )
  })
}
