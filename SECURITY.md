# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version  | Supported          |
| -------- | ------------------ |
| Latest   | :white_check_mark: |
| < Latest | :x:                |

## Reporting a Vulnerability

We take the security of Praetbot seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Where to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Go to the [Security tab](https://github.com/maniator/praetbot/security/advisories)
   - Click "Report a vulnerability"
   - Fill out the form with details

2. **Direct Contact**
   - Email the repository maintainer directly
   - Include "SECURITY" in the subject line

### What to Include

Please include the following information in your report:

- Type of vulnerability
- Full paths of source file(s) related to the manifestation of the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours of report
- **Status Update**: Within 7 days with initial assessment
- **Fix Timeline**: Depends on severity and complexity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

### Disclosure Policy

- We will acknowledge your report within 48 hours
- We will provide regular updates on our progress
- We will work with you to understand and resolve the issue
- We will publicly disclose the vulnerability after a fix is released (with your consent)
- We will credit you for the discovery (unless you prefer to remain anonymous)

## Security Best Practices for Users

### Environment Variables

- **Never commit** `.env` files to version control
- Use strong, unique values for all secrets
- Rotate credentials regularly
- Use environment-specific credentials (dev vs. prod)

### Discord Bot Token

- Keep your bot token secret
- Never share it in public channels, issues, or PRs
- Regenerate immediately if compromised
- Use Discord's token regeneration feature if needed

### MongoDB Security

- Use strong passwords for MongoDB users
- Enable MongoDB authentication
- Use connection strings with authentication
- Restrict MongoDB network access
- Keep MongoDB updated

### API Keys

- Store all API keys in environment variables
- Never hardcode API keys in source code
- Use separate keys for development and production
- Monitor API usage for anomalies

### Deployment

- Use HTTPS for all web traffic
- Keep dependencies updated
- Run with minimal required permissions
- Enable security features in Discord bot settings
- Monitor logs for suspicious activity

## Known Security Considerations

### Discord Intents

This bot requires the following Discord intents:

- `Guilds` - Access to guild information
- `GuildMessages` - Read messages in guilds
- `MessageContent` - Access message content (privileged)
- `GuildMembers` - Access to member information
- `DirectMessages` - Send DMs to users

**Note**: Message Content is a privileged intent. Ensure your bot is verified if serving 100+ servers.

### MongoDB Access

The bot requires:

- Read/write access to the configured database
- Ability to create collections
- Network access to MongoDB server

### Custom Commands

The custom command system allows users to execute JavaScript code. This is intentional but should be restricted to trusted users only. Consider:

- Implementing role-based access control for `!!addCommand`
- Sandboxing custom command execution
- Auditing custom commands regularly

## Security Updates

We regularly update dependencies to address security vulnerabilities. Updates are tracked in:

- [CHANGELOG.md](./CHANGELOG.md) - Version changes
- GitHub Security Advisories - Critical security issues
- Dependabot alerts - Dependency vulnerabilities

## Questions

If you have questions about this security policy, please open an issue with the `security` label.

---

**Remember**: Security is everyone's responsibility. If you see something, say something.
