# Development Guidelines for Fluenta

This document outlines the guidelines and best practices for implementing Fluenta. Both human developers and AI assistants should follow these guidelines to ensure consistency, maintainability, and high code quality.

## Project Implementation Principles

### 1. Adherence to Implementation Plan

- Always refer to the README.md implementation plan before starting work on a new feature
- Follow the phased approach as outlined in the plan
- Maintain the modular architecture described in the project structure
- Implement features in the order specified to ensure proper dependencies

### 2. Code Quality Standards

- All code must pass ESLint and Prettier checks without warnings or errors
- Follow TypeScript best practices with proper type definitions
- Maintain test coverage for critical functionality
- Use meaningful variable and function names that clearly describe their purpose
- Keep functions small and focused on a single responsibility
- Document complex logic with clear comments

### 3. Architectural Patterns

- Use React functional components with hooks
- Implement proper state management using React Context or similar patterns
- Follow the container/presentation component pattern
- Use custom hooks for reusable logic
- Implement proper error handling and loading states

### 4. AI Assistance Guidelines

When requesting AI assistance:

- Provide clear context about which phase and feature you're working on
- Reference specific sections of the implementation plan
- Ask for explanations of complex logic or patterns
- Request code reviews when appropriate

When AI is providing assistance:

- AI should always reference the implementation plan when suggesting solutions
- AI should explain the reasoning behind architectural decisions
- AI should follow established patterns in the codebase
- AI should highlight potential issues or improvements
- AI should provide complete, working solutions that adhere to the code quality standards

### 5. Consistency Checklist

Before submitting or accepting code:

- [ ] Code follows the established project structure
- [ ] Component naming is consistent with existing patterns
- [ ] Types are properly defined and used
- [ ] Error handling is implemented
- [ ] Code is properly formatted according to Prettier rules
- [ ] ESLint shows no warnings or errors
- [ ] Implementation matches the plan in the README
- [ ] New dependencies are justified and documented

## Development Workflow

### 1. Feature Implementation Process

1. **Planning**: Review the relevant section of the implementation plan
2. **Design**: Create a brief design document for complex features
3. **Implementation**: Write the code following the guidelines
4. **Testing**: Write and run tests to verify functionality
5. **Review**: Review the code against the consistency checklist
6. **Refinement**: Address any issues found during review
7. **Documentation**: Update documentation as needed

### 2. Commit Guidelines

- Use descriptive commit messages that explain the purpose of the change
- Reference the phase and feature from the implementation plan
- Keep commits focused on a single logical change
- Ensure all commits pass the pre-commit hooks

### 3. Code Review Process

- Review code against the consistency checklist
- Verify that the implementation matches the plan
- Check for potential edge cases or performance issues
- Ensure proper error handling
- Verify that the code is testable and tested

## Module-Specific Guidelines

### Authentication Module

- Use NextAuth.js for authentication
- Implement proper session handling
- Ensure secure password storage
- Implement proper authorization checks

### Dashboard Module

- Ensure responsive design for all screen sizes
- Optimize data fetching for performance
- Implement proper loading states
- Use appropriate data visualization components

### Reading Module

- Implement proper text processing
- Ensure accessibility for text-to-speech
- Optimize content generation
- Implement proper progress tracking

### Writing Module

- Implement proper text editing capabilities
- Ensure real-time feedback
- Implement draft saving and versioning
- Ensure proper evaluation of submissions

### Speaking Module

- Implement proper audio processing
- Ensure browser compatibility for speech recognition
- Optimize for performance and accuracy
- Implement proper feedback mechanisms

### Gamification Module

- Ensure balanced reward systems
- Implement proper progress tracking
- Create engaging visual feedback
- Ensure consistency across all learning modules

## Technology-Specific Guidelines

### React/Next.js

- Use the App Router for routing
- Implement proper data fetching strategies
- Use server components where appropriate
- Optimize for performance with proper code splitting

### TypeScript

- Use proper type definitions for all variables and functions
- Avoid using `any` type
- Use interfaces for object shapes
- Use type guards for runtime type checking

### MongoDB/Mongoose

- Use proper schema validation
- Implement indexes for frequently queried fields
- Use appropriate query methods for performance
- Implement proper error handling for database operations

### OpenAI API

- Implement proper error handling for API calls
- Use appropriate models for different tasks
- Optimize prompt engineering for best results
- Implement fallback mechanisms for API failures

## Conclusion

By following these guidelines, we ensure that Fluenta is implemented consistently, with high code quality, and according to the plan outlined in the README. Both human developers and AI assistants should refer to this document frequently during development.
