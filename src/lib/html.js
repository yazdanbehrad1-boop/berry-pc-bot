// Escape user-supplied text before interpolating it into an HTML email body.
// Without this, a value like `<img src=x onerror=...>` in a name or message
// field would be injected as live HTML into the recipient's inbox.
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
