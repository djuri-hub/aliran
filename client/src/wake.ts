// Channels sleep until somebody watches them, so the player has to say "I want this one" and
// give the broadcaster a moment to pull it from the provider. Fire-and-forget on purpose: a
// wake that never lands must not hold up the screen, and the tuner retries anyway.

const OPERATOR_HOST = "http://pivo.baraba.xyz:29313"

/** Ask the operator's on-demand service to start this channel. Safe to call repeatedly. */
export function wakeChannel (channelId: string): void {
  if (!channelId) return
  const url = `${OPERATOR_HOST}/wake?id=${encodeURIComponent(channelId)}`
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  void (async () => {
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        await fetch(url, { method: "GET" })
      } catch {
        /* the retry below is the answer to a failed wake */
      }
      // Three quick tries cover a channel that is already awake; the slower tail covers the
      // broadcaster's own start (ffmpeg up, feed registered) so the tune does not race it.
      await delay(attempt < 3 ? 600 : 1500)
    }
  })()
}
