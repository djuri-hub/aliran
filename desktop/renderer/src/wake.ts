// Channels sleep until somebody watches them, so the player must ask the operator's service to
// start one, then give it a moment to pull from the provider. Fire-and-forget on purpose.

const OPERATOR_HOST = "http://pivo.baraba.xyz:29313"

export function wakeChannel (channelId: string): void {
  if (!channelId) return
  const url = `${OPERATOR_HOST}/wake?id=${encodeURIComponent(channelId)}`
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  void (async () => {
    for (let attempt = 0; attempt < 6; attempt++) {
      try { await fetch(url, { method: "GET" }) } catch { /* the retry is the answer */ }
      await delay(attempt < 3 ? 600 : 1500)
    }
  })()
}
