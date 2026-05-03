# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| latest  | ✅        |

## Reporting a Vulnerability

If you discover a security vulnerability in DevDocs, please **do not** open a public GitHub issue.

Instead, report it privately:

1. **Email**: security@devdocs.app (replace with your real address)
2. **GitHub**: Use [GitHub's private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability) feature on this repo

Please include:
- A description of the vulnerability and its potential impact
- Steps to reproduce the issue
- Any relevant proof-of-concept code (do not include working exploits for destructive payloads)

We aim to respond within **72 hours** and to provide a fix or mitigation within **14 days** for confirmed critical issues.

## Security Considerations

- The admin panel is protected by a password stored as an environment secret (`ADMIN_PASSWORD`). Use a strong, unique value in production.
- Session tokens are signed with `SESSION_SECRET`. Rotate this value periodically.
- All write endpoints (`POST /api/posts`, `PUT /api/posts/:slug/update`, `DELETE /api/posts/:slug/delete`, `GET /api/newsletter/subscribers`, `DELETE /api/newsletter/subscribers/:id`) require admin authentication.
- User-submitted HTML is not accepted; post content is authored only through the admin panel.
- Newsletter emails are validated server-side with Zod before insertion.
