export function ok( res ) {
  if (Math.floor(res.status / 100) !== 2) {
    throw new Error(`status: ${res.status}\n` + JSON.stringify(res.body, null, ' '));
  }
}
