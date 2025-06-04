# Semantic Versioning

This project uses automatic semantic versioning based on commit message conventions. The version is automatically bumped and displayed at the bottom of the application.

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: A new feature (bumps MINOR version)
- **fix**: A bug fix (bumps PATCH version)
- **docs**: Documentation only changes (no version bump)
- **style**: Changes that do not affect the meaning of the code (no version bump)
- **refactor**: A code change that neither fixes a bug nor adds a feature (no version bump)
- **perf**: A code change that improves performance (bumps PATCH version)
- **test**: Adding missing tests or correcting existing tests (no version bump)
- **chore**: Changes to the build process or auxiliary tools (no version bump)

### Breaking Changes
Add `BREAKING CHANGE:` in the footer or `!` after the type to indicate a breaking change (bumps MAJOR version).

### Examples
```bash
feat(auth): add OAuth integration
fix(ui): resolve button alignment issue
feat!: remove deprecated API endpoints
BREAKING CHANGE: The old authentication system has been removed
```

## Version Display

The current version is displayed at the bottom-right corner of the application, showing:
- Version number
- Build date
- Commit hash (clickable link to GitHub)

## Automatic Versioning Workflow

1. **Commit Analysis**: GitHub Actions analyzes commit messages on pushes to main/master
2. **Version Calculation**: Semantic-release determines the next version number
3. **Release Creation**: Creates GitHub release with changelog
4. **Package Update**: Updates package.json with new version
5. **Build & Deploy**: Builds application with version info and deploys

## Dependabot Integration

Dependabot PRs are automatically formatted with proper commit messages:
- **Patch updates**: `fix(deps): update dependency-name`
- **Minor updates**: `feat(deps): update dependency-name`
- **Major updates**: `chore(deps): update dependency-name` (manual review required)

## Manual Release

To trigger a release manually, ensure your commit messages follow the convention and push to main/master. The workflow will automatically handle version bumping and deployment. 