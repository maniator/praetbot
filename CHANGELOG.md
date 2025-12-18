# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Complete migration from Slack to Discord.js v14
- Comprehensive test suite with Vitest (50 tests)
- ESLint and Prettier for code quality
- GitHub Actions CI/CD pipeline
- README.md with full documentation
- MIGRATION_SUMMARY.md documenting the migration process
- .env.example for environment configuration
- Vite build system
- TypeScript strict mode configuration

### Changed

- **BREAKING**: Bot now requires Discord bot token instead of Slack token
- **BREAKING**: User IDs are numeric (Discord format) instead of alphanumeric (Slack format)
- Updated Node.js from 10.15.0 to 20.19.6
- Updated TypeScript from 2.0.10 to 5.7.2
- Updated MongoDB driver from 2.2.11 to 6.11.0
- Updated Express from 4.14.0 to 4.21.2
- Converted from CommonJS to ESM modules
- Replaced callbacks with async/await throughout codebase
- Updated MongoDB API to use modern methods (replaceOne, deleteOne)

### Fixed

- Cookie system now works with Discord user mentions
- All commands adapted to Discord's message format
- Channel and user API calls updated for Discord.js

### Removed

- Slack dependencies (slackbots, slack packages)
- Jest testing framework (replaced with Vitest)
- Legacy CommonJS require statements

## [0.0.0] - Previous Version (Pre-Discord Migration)

### Features

- Cookie tracking system with ++ and -- commands
- Custom command system with MongoDB storage
- Built-in commands:
  - `!!help` - Command help system
  - `!!listCommands` - List all commands
  - `!!addCommand` - Add custom commands
  - `!!removeCommand` - Remove custom commands
  - `!!weather` - Weather information
  - `!!xkcd` - XKCD comic fetcher
  - `!!roll` - Random user picker
- Express web interface
- MongoDB integration
- Slack integration (deprecated)

---

## Migration Notes

### From Slack to Discord (Current Version)

This version represents a complete platform migration from Slack to Discord. If you're upgrading from a Slack-based installation:

1. **Update Environment Variables**
   - Replace `BOT_API_KEY` with a Discord bot token
   - Discord bot tokens start with `MT` or `OT` followed by base64 characters

2. **Database Compatibility**
   - User IDs in MongoDB need to be updated from Slack format to Discord format
   - Cookie data will need migration if preserving user history

3. **Discord Bot Setup**
   - Create a Discord application at https://discord.com/developers/applications
   - Enable required intents: Guilds, Guild Messages, Message Content, Guild Members
   - Add bot to your Discord server with appropriate permissions

4. **Testing**
   - Test in a development Discord server first
   - Verify all commands work as expected
   - Check cookie system functionality

For detailed migration information, see [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md).
