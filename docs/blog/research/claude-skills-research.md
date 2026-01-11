# Claude Skills: Complete Beginner's Guide to AI Agent Customization

**Author:** Research Agent (Gheware DevOps AI)
**Date:** 2026-01-11
**Last Updated:** 2026-01-11
**Target Content:** Blog Post - Video

### Freshness Metadata
| Metric | Value |
|--------|-------|
| **Research Date** | 2026-01-11 |
| **Sources Date Range** | 2025-10 to 2026-01 |
| **Software Versions** | Claude Skills spec 2025-10-02 beta, Claude Code latest |
| **Freshness Rating** | Current |

> **Freshness Rating Scale:**
> - Current - All sources less than 6 months old, versions verified
> - Recent - Some sources 6-12 months old, may need review
> - Review Needed - Sources older than 12 months, verify before publishing

---

## Executive Summary

Claude Skills represent a paradigm shift in how we customize AI assistants. Released by Anthropic in October 2025 and published as an open standard in December 2025, Skills are organized folders of instructions, scripts, and resources that Claude can discover and load dynamically to perform specialized tasks.

Unlike traditional prompt engineering or system prompts, Skills use a "progressive disclosure" architecture that allows Claude to load only the relevant context when needed, making them extremely token-efficient. At startup, only metadata (approximately 100 tokens) is pre-loaded; full instructions (less than 5,000 tokens) load only when Claude determines the Skill applies to the current task.

Skills have been adopted by major platforms including Microsoft, OpenAI, Atlassian, Figma, Cursor, and GitHub, making them a cross-platform standard for AI agent customization. Partner-built Skills from Canva, Stripe, Notion, and Zapier are available at launch. This positions Skills as the second major open standard from Anthropic, following the Model Context Protocol (MCP) which was transferred to the Linux Foundation.

---

## Table of Contents
1. [What Are Claude Skills?](#what-are-claude-skills)
2. [How Skills Work](#how-skills-work)
3. [Creating Your First Skill](#creating-your-first-skill)
4. [SKILL.md Anatomy and Syntax](#skillmd-anatomy-and-syntax)
5. [Skills vs MCP vs Tools](#skills-vs-mcp-vs-tools)
6. [Real-World Use Cases](#real-world-use-cases)
7. [Domain-Specific Examples](#domain-specific-examples)
8. [Best Practices](#best-practices)
9. [Limitations and Pricing](#limitations-and-pricing)
10. [Key Findings](#key-findings)

---

## VIDEO PIPELINE SECTIONS

### Video Content Hooks

1. **Hook 1:** "Claude Skills are now an open standard adopted by Microsoft, OpenAI, and GitHub - build once, run everywhere" - Anthropic December 2025 announcement
2. **Hook 2:** "Skills use only 100 tokens for metadata scanning, making them 10-100x more efficient than traditional system prompts" - Claude documentation
3. **Hook 3:** "NBIM (Norwegian Sovereign Wealth Fund) saved 213,000 hours annually using Claude Skills for financial analysis" - Anthropic case study
4. **Hook 4:** "Progressive disclosure means Skills can bundle effectively unlimited context without overwhelming Claude's context window" - Anthropic engineering blog
5. **Hook 5:** "Create a reusable DevOps Skill in 10 minutes that automates Terraform, Kubernetes, and CI/CD workflows" - Community examples

### Key Quotable Statements (AEO Optimized)

1. "Claude Skills are organized folders of instructions, scripts, and resources that Claude loads dynamically to perform specialized tasks."
2. "Skills use progressive disclosure architecture, loading metadata at startup and full instructions only when relevant to the current task."
3. "Unlike MCP which connects Claude TO external systems, Skills teach Claude HOW to perform tasks with procedures, workflows, and patterns."
4. "A Claude Skill requires only a SKILL.md file with YAML frontmatter containing a name and description - no code is required for basic skills."
5. "Skills are available on Pro ($20/month), Max ($100-200/month), Team ($25-30/month), and Enterprise plans."
6. "The Agent Skills specification was published as an open standard in December 2025, adopted by Microsoft, OpenAI, Atlassian, Figma, Cursor, and GitHub."
7. "Progressive disclosure allows Skills to bundle comprehensive resources without context penalty - files load only when accessed."
8. "Skills can include executable scripts (Python, Node.js, Bash) that Claude runs without loading script code into the context window."
9. "Custom Skills in Claude Code are filesystem-based, stored in ~/.config/claude/skills/ or .claude/skills/, and require no API uploads."
10. "Skills complement MCP: a single Skill can orchestrate multiple MCP servers, while a single MCP server can support dozens of different Skills."

### Visual/Diagram Opportunities

| Concept | Visual Type | Description |
|---------|-------------|-------------|
| Progressive Disclosure | Pyramid/Layers | Show metadata (top) to instructions to resources (bottom) |
| Skill vs MCP vs Tools | Comparison Table | 3-column showing purpose, token usage, examples |
| SKILL.md Anatomy | Annotated Code Block | Frontmatter + body with callouts |
| Skill Discovery Flow | Flowchart | User request to metadata scan to full load |
| DevOps Skill Structure | Directory Tree | .claude/skills/terraform/SKILL.md + scripts |

### Certification Alignment
**Exam:** Not certification-specific (AI/DevOps general topic)
**Domain:** AI Agent Development, DevOps Automation

**Learning Objectives Covered:**
- [ ] Understanding Claude Skills architecture and purpose
- [ ] Creating and deploying custom Skills
- [ ] Integrating Skills with DevOps workflows
- [ ] Distinguishing Skills from MCP and traditional tools

**Official Resources:**
- [Claude Skills Documentation](https://code.claude.com/docs/en/skills)
- [Anthropic Skills Repository](https://github.com/anthropics/skills)

---

## BLOG POST HANDOFF

### Suggested Blog Title
**Primary:** Claude Skills Tutorial 2026: Build Custom AI Workflows in 10 Minutes (Complete Beginner's Guide)
**Alternative 1:** What Are Claude Skills? The Open Standard Changing AI Development Forever
**Alternative 2:** How Do Claude Skills Work? Everything Beginners Need to Know in 2026

### Key Takeaways (for blog Key Takeaways box)
- Claude Skills are modular, reusable "task packs" that teach Claude repeatable workflows using folders of instructions and scripts
- Skills use progressive disclosure to load only relevant context, making them extremely token-efficient (approximately 100 tokens for metadata)
- Creating a basic Skill requires only a SKILL.md file with YAML frontmatter (name + description) - no coding required
- Skills differ from MCP (which connects TO systems) by teaching Claude HOW to perform tasks with procedures and patterns
- Skills became an open standard in December 2025, adopted by Microsoft, OpenAI, GitHub, and other major platforms

### FAQ Candidates (for blog FAQ section)
**Q1: What are Claude Skills?**
A: Claude Skills are organized folders containing instructions, scripts, and resources that Claude can discover and load dynamically. They teach Claude how to perform specialized tasks in a repeatable way, like working with Excel files, following brand guidelines, or automating DevOps workflows.

**Q2: How do Claude Skills differ from system prompts?**
A: Unlike system prompts that consume context tokens constantly, Skills use "progressive disclosure" - only metadata (approximately 100 tokens) loads at startup, with full instructions loading only when relevant. This makes Skills much more token-efficient and allows bundling comprehensive resources.

**Q3: Do I need to code to create Claude Skills?**
A: No, basic Skills require only a SKILL.md file containing YAML frontmatter (name and description) plus markdown instructions. Advanced Skills can optionally include Python, Node.js, or Bash scripts for deterministic operations, but coding is not required for getting started.

**Q4: What's the difference between Claude Skills and MCP servers?**
A: MCP connects Claude TO external systems (databases, APIs, cloud services), while Skills teach Claude HOW to perform tasks (procedures, workflows, standards). They work together: a single Skill can orchestrate multiple MCP servers, and a single MCP server can support multiple Skills.

**Q5: How do I get started with Claude Skills?**
A: Create a folder in .claude/skills/ with a SKILL.md file containing YAML frontmatter (name and description) and markdown instructions. Claude automatically discovers Skills and loads them when relevant. For pre-built Skills, install from the Anthropic marketplace using /plugin marketplace add anthropics/skills.

### Target Keywords
**Primary:** Claude Skills
**Secondary:** Claude Skills tutorial, Claude agent skills, create Claude skill, SKILL.md
**Long-tail:** how to create Claude Skills for beginners, Claude Skills vs MCP comparison 2026, Claude Code Skills DevOps automation
**LSI/Related:** AI agent customization, Anthropic Skills, progressive disclosure AI, Claude workflow automation

---

## MAIN RESEARCH CONTENT

## What Are Claude Skills?

Claude Skills are a fundamental feature released by Anthropic in October 2025 that allows users to customize Claude's behavior through modular, reusable instruction packages. At their core, Skills are organized folders of instructions, scripts, and resources that Claude can discover and load dynamically when they are relevant to the current task.

### Key Characteristics

1. **Modular Design**: Each Skill is self-contained in its own directory with a SKILL.md file as the entry point
2. **Dynamic Discovery**: Claude automatically scans available Skills and determines when to use them based on the current task
3. **Progressive Disclosure**: Only metadata loads initially; full instructions load on-demand
4. **Cross-Platform**: Published as an open standard, Skills work across Claude.ai, Claude Code, API, and third-party platforms
5. **No-Code Friendly**: Basic Skills require only markdown - no programming necessary

### What Skills Can Do

Skills enable Claude to:
- Follow organization-specific workflows and standards
- Work with specialized file formats (Excel, PowerPoint, Word, PDF)
- Execute deterministic operations via bundled scripts
- Apply brand guidelines and communication standards
- Automate complex multi-step processes
- Integrate with external systems via MCP connections

### Availability

Skills are available for:
- **Pro Plan**: $20/month
- **Max Plans**: $100-200/month (5x to 20x usage)
- **Team Plan**: $25-30/month per seat (minimum 5 members)
- **Enterprise Plan**: Custom pricing (approximately $60/seat, minimum 70 users)

Free tier users do not have access to Skills.

## How Skills Work

### Progressive Disclosure Architecture

The progressive disclosure architecture is what makes Skills efficient and scalable. This approach is like a well-organized manual that starts with a table of contents, then specific chapters, and finally detailed appendix information.

**Loading Stages:**

1. **Metadata Loading (approximately 100 tokens)**: At startup, Claude scans all available Skills and loads only the name and description from each SKILL.md frontmatter
2. **Skill Selection**: Based on the user's request, Claude semantically matches the task to relevant Skill descriptions
3. **Full Instructions (less than 5,000 tokens)**: When Claude determines a Skill applies, it reads the full SKILL.md body
4. **Resource Loading**: Additional files (reference.md, examples.md, scripts/) load only as needed

**Token Efficiency:**
- Metadata scanning uses approximately 100 tokens regardless of how many Skills are available
- Full SKILL.md content loads only when triggered
- Scripts execute without loading into context (only output consumes tokens)
- Reference files load on-demand, not upfront

### Skill Discovery Flow

```
User Request
    |
    v
Metadata Scan (all Skills, approximately 100 tokens)
    |
    v
Semantic Matching (description vs. request)
    |
    v
Skill Triggered? ----No----> Normal Claude behavior
    |
   Yes
    v
Load SKILL.md body (less than 5K tokens)
    |
    v
Read additional files as needed
    |
    v
Execute bundled scripts if applicable
    |
    v
Complete task using Skill guidance
```

### Storage Locations

Claude discovers Skills from multiple locations:

| Location | Purpose | Scope |
|----------|---------|-------|
| ~/.config/claude/skills/ | User-level Skills | Personal use across projects |
| .claude/skills/ | Project-level Skills | Shared via version control |
| ~/.claude/skills/ | Alternative user location | Personal Skills |
| Plugin marketplace | Community/Official Skills | Installable packages |
| Built-in Skills | Anthropic-provided | Document handling, etc. |

## Creating Your First Skill

### Minimal Skill Structure

The simplest possible Skill is a single directory containing a SKILL.md file:

```
.claude/skills/
└── my-first-skill/
    └── SKILL.md
```

### Step-by-Step Creation

**Step 1: Create the directory**
```bash
mkdir -p .claude/skills/greeting-generator
```

**Step 2: Create SKILL.md with required frontmatter**
```markdown
---
name: greeting-generator
description: Generates personalized greetings for emails, messages, and announcements. Use when the user asks for help writing greetings, welcomes, or introductions.
---

# Greeting Generator

## Overview
This skill helps create warm, professional greetings for various contexts.

## Instructions
1. Identify the context (email, message, announcement)
2. Determine the tone (formal, casual, celebratory)
3. Include personalization when names are provided
4. Keep greetings concise but warm

## Examples

### Formal Email Greeting
"Dear [Name], I hope this message finds you well."

### Casual Team Message
"Hey team! Quick update for everyone..."

### Celebratory Announcement
"We're thrilled to announce..."

## Guidelines
- Match tone to context
- Use recipient's name when available
- Avoid overly generic phrases
- Consider cultural appropriateness
```

**Step 3: Test the Skill**
Simply ask Claude something that matches the Skill description:
"Help me write a greeting for a project kickoff email to the engineering team"

Claude will automatically discover and apply the greeting-generator Skill.

### Expanded Skill Structure

For more complex Skills, use this structure:

```
.claude/skills/
└── pdf-processing/
    ├── SKILL.md              # Main instructions
    ├── FORMS.md              # Form-filling guide
    ├── reference.md          # API reference
    ├── examples.md           # Usage examples
    └── scripts/
        ├── analyze_form.py   # Utility script
        ├── fill_form.py      # Form filling script
        └── validate.py       # Validation script
```

## SKILL.md Anatomy and Syntax

### Required Frontmatter

Every SKILL.md must begin with YAML frontmatter containing two required fields:

```yaml
---
name: my-skill-name
description: A clear description of what this skill does and when to use it
---
```

**Name Requirements:**
- Maximum 64 characters
- Only lowercase letters, numbers, and hyphens
- No XML tags
- Cannot contain reserved words: "anthropic", "claude"

**Description Requirements:**
- Maximum 1,024 characters (but aim for 100-200)
- Must be non-empty
- No XML tags
- Should describe BOTH what the Skill does AND when to use it
- Write in third person ("Processes Excel files" not "I can process Excel files")

### Optional Frontmatter Fields

```yaml
---
name: terraform-validator
description: Validates Terraform configurations against best practices and security policies. Use when reviewing .tf files or planning infrastructure changes.
allowed-tools: Read, Grep, Glob, Bash
model: claude-sonnet-4-20250514
dependencies:
  - terraform >= 1.5.0
  - tfsec >= 1.28.0
---
```

### Body Structure

The body uses standard Markdown. Recommended sections:

```markdown
# Skill Name

## Overview
Brief summary of the skill's purpose (2-3 sentences)

## Instructions
Step-by-step guidance for Claude to follow

## Examples
Input/output pairs showing expected behavior

## Guidelines
Do's and don'ts for applying the skill

## References
Links to additional files when needed:
- **API Details**: See [reference.md](reference.md)
- **Advanced Features**: See [advanced.md](advanced.md)
```

### Template Examples

**Example 1: Simple No-Code Skill**
```markdown
---
name: code-review-checklist
description: Applies code review best practices and generates structured feedback. Use when reviewing pull requests or code changes.
---

# Code Review Checklist

## Overview
Ensures consistent, thorough code reviews across the team.

## Review Process

### 1. Code Quality
- [ ] Functions are under 50 lines
- [ ] Variable names are descriptive
- [ ] No magic numbers or strings
- [ ] DRY principle followed

### 2. Testing
- [ ] Unit tests added for new code
- [ ] Edge cases covered
- [ ] Tests are readable and maintainable

### 3. Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] SQL injection prevention if applicable

### 4. Documentation
- [ ] Public APIs documented
- [ ] Complex logic explained
- [ ] README updated if needed

## Output Format
Provide feedback using this structure:
1. **Summary**: One-line overall assessment
2. **Must Fix**: Critical issues blocking approval
3. **Should Fix**: Important improvements
4. **Nice to Have**: Minor suggestions
5. **Praise**: What was done well
```

**Example 2: Skill with Scripts**
```markdown
---
name: dockerfile-analyzer
description: Analyzes Dockerfiles for best practices, security issues, and optimization opportunities. Use when reviewing or creating Dockerfiles.
---

# Dockerfile Analyzer

## Overview
Validates Dockerfiles against industry best practices and suggests improvements.

## Quick Start

Analyze a Dockerfile:
```bash
python scripts/analyze.py Dockerfile
```

## Analysis Categories

### Security
- No root user in production
- Minimal base images preferred
- No secrets in build args

### Performance
- Multi-stage builds for compiled languages
- Layer ordering for cache optimization
- .dockerignore utilization

### Maintainability
- Specific version tags (not :latest)
- Labels for metadata
- Clear documentation

## Scripts

**analyze.py**: Full Dockerfile analysis
```bash
python scripts/analyze.py <dockerfile-path>
# Returns JSON report with issues and suggestions
```

**validate.py**: Quick pass/fail check
```bash
python scripts/validate.py <dockerfile-path>
# Returns: PASS or lists blocking issues
```

## Integration
Run analysis, review output, address critical issues first, then optimization suggestions.
```

## Skills vs MCP vs Tools

### Key Distinction

**MCP connects Claude TO data; Skills teach Claude WHAT TO DO with that data.**

| Aspect | Claude Skills | MCP Servers | Traditional Tools |
|--------|---------------|-------------|-------------------|
| **Purpose** | Teach HOW to perform tasks | Connect TO external systems | Execute specific functions |
| **Content** | Procedures, workflows, patterns | APIs, databases, services | Function definitions |
| **Token Cost** | approximately 100 tokens (metadata) | 100-300 tokens per tool | Per-function definitions |
| **Loading** | On-demand, progressive | Every request | Per request |
| **Creation** | Markdown + optional scripts | Code (TypeScript/Python) | Function schemas |
| **Portability** | Open standard (cross-platform) | Open protocol | Vendor-specific |

### How They Work Together

"This separation keeps the architecture composable. A single skill can orchestrate multiple MCP servers, while a single MCP server can support dozens of different skills."

**Example Integration:**
- MCP Server: Connects Claude to Notion workspace
- Skill: "Meeting Prep" - teaches Claude which Notion pages to pull, how to format prep documents, and team standards for meeting notes

**Workflow:**
```
User: "Prepare for tomorrow's product review meeting"
         |
         v
[Skill: Meeting Prep]
"Read meeting-prep.md for procedures"
         |
         v
[MCP: Notion Server]
"Fetch agenda from Notion page X"
         |
         v
[Skill: Meeting Prep]
"Format using team template"
         |
         v
Final Output: Formatted meeting prep document
```

### Complementary Roles

| Scenario | MCP Provides | Skill Provides |
|----------|--------------|----------------|
| Sales Analysis | BigQuery connection | Query patterns, metric definitions |
| Document Creation | File system access | Brand guidelines, templates |
| Code Review | GitHub integration | Review checklist, team standards |
| Incident Response | PagerDuty, Slack | Runbooks, escalation procedures |

## Real-World Use Cases

### Official Anthropic Skills

1. **Document Skills (docx, xlsx, pptx, pdf)**
   - Create and edit Word documents with tracked changes
   - Build Excel spreadsheets with formulas and charts
   - Generate PowerPoint presentations with layouts
   - Fill PDF forms and extract data

2. **Design and Creative**
   - Algorithmic art using p5.js
   - Canvas design in PNG and PDF
   - Slack GIF creator

3. **Development**
   - Frontend design (avoiding generic aesthetics)
   - MCP server builder
   - Web app testing with Playwright

### Enterprise Examples

**NBIM (Norwegian Sovereign Wealth Fund):**
- 213,000 hours saved annually
- Approximately 20% productivity gains
- Portfolio managers query Snowflake data warehouse seamlessly
- Analyze earnings calls with unprecedented efficiency

**AIG:**
- 80% faster underwriting processes
- Skills automate policy analysis and risk assessment

**General Enterprise:**
- 5x compression in business review timelines
- Skills streamline management accounting and finance workflows

### Community Skills

From the [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) repository:

| Skill | Purpose |
|-------|---------|
| ios-simulator-skill | iOS app testing automation |
| ffuf-web-fuzzing | Security testing automation |
| playwright-skill | Browser automation and testing |
| claude-d3js-skill | Data visualization creation |
| claude-scientific-skills | Research and analysis workflows |
| loki-mode | Multi-agent startup orchestration |

### Hugging Face ML Experiments

"How We Use Claude Code Skills to Run 1,000+ ML Experiments a Day" - Sionic AI documented using Skills to:
- Standardize experiment configurations
- Automate hyperparameter sweeps
- Generate consistent training reports
- Manage GPU resource allocation

## Domain-Specific Examples

### DevOps Domain

**1. Terraform IaC Skill**
```markdown
---
name: terraform-iac
description: Creates and validates Terraform configurations following company standards. Use when writing or reviewing .tf files, planning infrastructure, or troubleshooting Terraform state.
---

# Terraform IaC Standards

## Module Structure
```
modules/
├── vpc/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── versions.tf
├── eks/
└── rds/
```

## Naming Conventions
- Resources: `{env}-{project}-{resource-type}`
- Variables: `snake_case`
- Outputs: `{resource}_id`, `{resource}_arn`

## Required Tags
All resources must include:
```hcl
tags = {
  Environment = var.environment
  Project     = var.project_name
  ManagedBy   = "terraform"
  Owner       = var.team_email
}
```

## Security Requirements
- No hardcoded secrets (use AWS Secrets Manager)
- Enable encryption at rest for all storage
- Restrict security groups to minimum required ports
- Use private subnets for databases

## Validation
Run before apply:
```bash
terraform fmt -check
terraform validate
tfsec .
```
```

**2. Kubernetes Troubleshooting Skill**
```markdown
---
name: k8s-troubleshooter
description: Diagnoses Kubernetes issues and provides remediation steps. Use when pods are failing, services are unreachable, or cluster health is degraded.
---

# Kubernetes Troubleshooting Guide

## Diagnostic Workflow

### Step 1: Identify the Problem
```bash
kubectl get pods -A | grep -v Running
kubectl get events --sort-by='.lastTimestamp' | tail -20
```

### Step 2: Pod Issues

**CrashLoopBackOff:**
1. Check logs: `kubectl logs <pod> --previous`
2. Check resources: `kubectl describe pod <pod>`
3. Common causes: OOMKilled, missing config, failed probes

**ImagePullBackOff:**
1. Verify image exists: `docker pull <image>`
2. Check registry credentials
3. Verify network access to registry

**Pending:**
1. Check node resources: `kubectl describe nodes`
2. Check PVC bindings
3. Check nodeSelector/affinity rules

### Step 3: Service Issues
```bash
kubectl get endpoints <service>
kubectl get svc <service> -o yaml
```

## Quick Reference

| Symptom | First Check | Common Fix |
|---------|-------------|------------|
| Pod not starting | `describe pod` | Fix image/config |
| Service no endpoints | Pod labels | Match selector |
| OOMKilled | Resource limits | Increase memory |
```

**3. CI/CD Pipeline Skill**
```markdown
---
name: ci-cd-optimizer
description: Creates and optimizes CI/CD pipelines for GitHub Actions, GitLab CI, and Jenkins. Use when setting up new pipelines, improving build times, or implementing security scanning.
---

# CI/CD Pipeline Standards

## GitHub Actions Template
```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run build

  security:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Trivy
        uses: aquasecurity/trivy-action@master
```

## Optimization Rules
1. Cache dependencies (npm, pip, Maven)
2. Use matrix builds for multiple versions
3. Fail fast on first error
4. Parallelize independent jobs
5. Use artifacts for cross-job data

## Security Requirements
- No secrets in code (use GitHub Secrets)
- Scan dependencies (Dependabot, Snyk)
- Container image scanning
- SAST for custom code
```

### Finance Domain

**1. Financial Analysis Skill**
```markdown
---
name: financial-analysis
description: Analyzes financial statements, calculates key metrics, and generates investment reports. Use when reviewing earnings, building DCF models, or comparing company financials.
---

# Financial Analysis Procedures

## Key Metrics to Calculate

### Profitability
- Gross Margin = (Revenue - COGS) / Revenue
- Operating Margin = Operating Income / Revenue
- Net Margin = Net Income / Revenue
- ROE = Net Income / Shareholders' Equity
- ROIC = NOPAT / Invested Capital

### Valuation
- P/E Ratio = Price / EPS
- EV/EBITDA = Enterprise Value / EBITDA
- P/B Ratio = Price / Book Value
- DCF = Sum of (FCF / (1 + WACC)^n)

### Liquidity
- Current Ratio = Current Assets / Current Liabilities
- Quick Ratio = (Cash + Receivables) / Current Liabilities
- Debt/Equity = Total Debt / Shareholders' Equity

## Report Structure
1. Executive Summary (3-5 key findings)
2. Financial Performance Analysis
3. Peer Comparison
4. Valuation Assessment
5. Risk Factors
6. Investment Recommendation

## Data Sources
- 10-K/10-Q filings (SEC EDGAR)
- Earnings call transcripts
- Industry reports
- Comparable company data

## Output Format
Always include:
- Data table with key metrics
- YoY and QoQ comparisons
- Industry benchmarks
- Visual charts when appropriate
```

**2. Risk Assessment Skill**
```markdown
---
name: risk-assessment
description: Evaluates investment risks, performs Monte Carlo simulations, and generates risk reports. Use when analyzing portfolio risk, stress testing, or regulatory compliance.
---

# Risk Assessment Framework

## Risk Categories

### Market Risk
- Value at Risk (VaR) - 95% and 99% confidence
- Expected Shortfall (CVaR)
- Beta coefficient
- Correlation analysis

### Credit Risk
- Default probability
- Loss given default
- Exposure at default
- Credit rating implications

### Operational Risk
- Process failures
- System outages
- Human error
- External events

## Monte Carlo Simulation

### Parameters
```python
simulations = 10000
time_horizon = 252  # trading days
confidence_levels = [0.95, 0.99]
```

### Output
1. VaR at specified confidence levels
2. Expected Shortfall
3. Distribution of outcomes
4. Worst-case scenarios

## Stress Testing Scenarios
- 2008 Financial Crisis replay
- Interest rate +300bps shock
- Market drawdown -30%
- Currency devaluation -20%

## Compliance Checks
- Basel III requirements
- Dodd-Frank reporting
- CCAR stress tests
- Internal risk limits
```

### E-Commerce Domain

**1. Inventory Management Skill**
```markdown
---
name: inventory-manager
description: Optimizes inventory levels, predicts demand, and manages stock across warehouses. Use when analyzing inventory, planning reorders, or optimizing supply chain.
---

# Inventory Management System

## Key Metrics

### Stock Levels
- Days of Supply = Current Inventory / Daily Sales Rate
- Stock Turn = COGS / Average Inventory
- Fill Rate = Orders Fulfilled / Total Orders

### Reorder Calculations
- Reorder Point = (Lead Time * Daily Sales) + Safety Stock
- Safety Stock = Z-score * Std Dev of Demand * Sqrt(Lead Time)
- Economic Order Quantity = Sqrt((2 * Demand * Order Cost) / Holding Cost)

## Alert Thresholds
| Status | Days of Supply |
|--------|----------------|
| Critical | < 7 days |
| Low | 7-14 days |
| Normal | 14-45 days |
| Excess | > 45 days |

## Demand Forecasting
1. Historical sales analysis (trailing 52 weeks)
2. Seasonal adjustment factors
3. Trend identification
4. Promotional impact modeling

## Actions

### Low Stock
1. Check supplier lead times
2. Evaluate expedited shipping cost
3. Identify substitute products
4. Update availability on storefront

### Excess Stock
1. Analyze slow-moving items
2. Propose markdown strategy
3. Consider warehouse transfer
4. Evaluate liquidation options
```

**2. Customer Service Skill**
```markdown
---
name: customer-service
description: Handles customer inquiries, processes returns, and escalates issues appropriately. Use when responding to customer tickets, chat, or reviewing service quality.
---

# Customer Service Guidelines

## Response Templates

### Order Status
"Hi [Name], your order #[ORDER] is currently [STATUS].
Expected delivery: [DATE].
Track it here: [LINK]"

### Return Request
"I understand you'd like to return [ITEM].
Our 30-day return policy covers this purchase.
Here's your return label: [LINK]
Refund processed within 5-7 business days of receipt."

### Issue Escalation
"I apologize for this experience.
I'm escalating to our specialist team.
Expect a response within 24 hours.
Reference: [TICKET]"

## Escalation Triggers
- Customer mentions legal action
- Third return request in 30 days
- Order value > $500 with issue
- Shipping delay > 14 days
- Social media mention

## Tone Guidelines
- Empathetic first, solution second
- Acknowledge frustration
- Take ownership ("I will" not "We will")
- Offer specific next steps
- End with confirmation

## Metrics to Track
- First Response Time (target: < 4 hours)
- Resolution Time (target: < 24 hours)
- CSAT Score (target: > 4.5/5)
- First Contact Resolution (target: > 70%)
```

## Best Practices

### Structure and Design

1. **Keep SKILL.md Under 500 Lines**
   - Push detailed docs to separate referenced files
   - Use progressive disclosure for complex content

2. **Write Trigger-Rich Descriptions**
   - Claude uses semantic matching on descriptions
   - Include key terms users might say
   - Example: "Processes Excel files, spreadsheets, .xlsx files, tabular data"

3. **Use Third Person in Descriptions**
   - Good: "Processes Excel files and generates reports"
   - Bad: "I can help you process Excel files"

4. **Consistent Naming**
   - Use gerund form: "processing-pdfs", "analyzing-spreadsheets"
   - Lowercase letters, numbers, hyphens only

### Content Guidelines

5. **Avoid Time-Sensitive Information**
   - Bad: "If before August 2025, use old API"
   - Good: Use "Old patterns" section with collapsible details

6. **Use Consistent Terminology**
   - Choose one term and use it throughout
   - Document your terminology choices

7. **Provide Examples**
   - Include input/output pairs
   - Show expected format and style

8. **Reference Files One Level Deep**
   - Bad: SKILL.md references advanced.md references details.md
   - Good: SKILL.md references all files directly

### Code and Scripts

9. **Solve, Do Not Punt**
   - Handle errors explicitly in scripts
   - Do not rely on Claude to figure out failures

10. **Document Configuration Values**
    - Explain why timeout = 30 seconds
    - No "magic numbers" without justification

11. **Create Verifiable Outputs**
    - Use plan to validate to execute pattern
    - Add validation scripts for critical operations

### Testing

12. **Test with Multiple Models**
    - Haiku: Provide more guidance
    - Sonnet: Balance clarity and efficiency
    - Opus: Avoid over-explaining

13. **Build Evaluations First**
    - Create test scenarios before writing extensive docs
    - Measure baseline, then iterate

14. **Gather Team Feedback**
    - Does Skill activate when expected?
    - Are instructions clear?
    - What is missing?

## Limitations and Pricing

### Plan Requirements

| Plan | Price | Skills Access |
|------|-------|---------------|
| Free | $0 | No access |
| Pro | $20/month | Yes |
| Max 5x | $100/month | Yes |
| Max 20x | $200/month | Yes |
| Team | $25-30/month per seat | Yes |
| Enterprise | approximately $60/seat | Yes |

### Token Limits

Claude Code operates on a 5-hour rolling window:
- Pro: approximately 44,000 tokens per window
- Max 5x: approximately 88,000 tokens per window
- Max 20x: approximately 220,000 tokens per window

Starting August 2025, weekly limits were added on top of 5-hour windows.

### Technical Limitations

1. **No Centralized Admin Management**: Claude.ai does not support org-wide distribution of custom Skills (as of January 2026)

2. **API Context**: When using Skills via API with code execution, the container environment has specific limitations

3. **Description Length**: Maximum 1,024 characters, which limits matching precision

4. **Up to 8 Skills Per Request**: When using the API, maximum of 8 Skills can be included per request

### Open Standard Adoption

As of December 2025, the Agent Skills specification is adopted by:
- Microsoft
- OpenAI
- Atlassian
- Figma
- Cursor
- GitHub

Partner-built Skills available from:
- Canva
- Stripe
- Notion
- Zapier

## Key Findings

1. **Skills Are the New Standard**: With adoption by Microsoft, OpenAI, GitHub, and others, Claude Skills have become a cross-platform standard for AI agent customization

2. **Progressive Disclosure Is Revolutionary**: The ability to bundle unlimited context without token penalties fundamentally changes how we can customize AI assistants

3. **No-Code Creation Possible**: Basic Skills require only a SKILL.md file with frontmatter - no programming needed to get started

4. **Skills Complement MCP**: Rather than competing, Skills teach "how" while MCP provides "connectivity" - they work together

5. **Enterprise Ready**: With 213,000 hours saved at NBIM and 80% faster underwriting at AIG, Skills have proven enterprise value

6. **DevOps Strong Use Case**: CI/CD, Kubernetes, Terraform, and infrastructure automation are prime candidates for Skills-based workflows

7. **Token Efficiency Matters**: Skills use approximately 100 tokens for metadata vs. thousands for traditional approaches

8. **Community Growing Rapidly**: The anthropics/skills repository has 37.4K stars and community marketplaces are emerging

## Conclusions

Claude Skills represent a significant evolution in AI customization. By providing a structured, token-efficient way to teach Claude specialized tasks, Anthropic has created a system that is:

- **Accessible**: No coding required for basic Skills
- **Scalable**: Progressive disclosure handles unlimited content
- **Portable**: Open standard works across platforms
- **Practical**: Real enterprise ROI demonstrated

For DevOps teams, Skills offer the ability to codify infrastructure standards, automate runbooks, and ensure consistent practices across Claude interactions. For any domain, Skills provide a way to package institutional knowledge into reusable, shareable packages.

## Recommendations

1. **Start Simple**: Create a basic Skill with just SKILL.md before adding scripts
2. **Focus on Description**: The description is critical for discovery - invest time here
3. **Test Iteratively**: Use "Claude A" to write Skills, "Claude B" to test them
4. **Leverage Community**: Check anthropics/skills and awesome-claude-skills before building from scratch
5. **Document Your Patterns**: Skills are knowledge capture - document what works for your team
6. **Consider MCP Integration**: Plan how Skills will work with your MCP connections

---

## CITATIONS & RESOURCES

### Official Documentation (for video description)

| Resource | URL | Use For |
|----------|-----|---------|
| Claude Skills Documentation | https://code.claude.com/docs/en/skills | Primary reference |
| Anthropic Skills Repository | https://github.com/anthropics/skills | Official examples |
| Skills Best Practices | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices | Authoring guide |
| API Skills Guide | https://platform.claude.com/docs/en/build-with-claude/skills-guide | API integration |
| Skills Announcement | https://www.anthropic.com/news/skills | Feature launch |

### All Citations

1. [Agent Skills - Claude Code Docs](https://code.claude.com/docs/en/skills) - Official Claude Code Skills documentation
2. [GitHub - anthropics/skills](https://github.com/anthropics/skills) - Public repository for Agent Skills with examples
3. [Introducing Agent Skills | Claude](https://www.anthropic.com/news/skills) - Official Anthropic announcement (October 2025)
4. [Skill authoring best practices - Claude Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) - Comprehensive best practices guide
5. [GitHub - travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) - Community curated list of Claude Skills
6. [How to Build Claude Skills: Lesson Plan Generator Tutorial | Codecademy](https://www.codecademy.com/article/how-to-build-claude-skills) - Step-by-step tutorial
7. [Claude Skills vs. MCP: A Technical Comparison | IntuitionLabs](https://intuitionlabs.ai/articles/claude-skills-vs-mcp) - Skills vs MCP comparison
8. [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://claude.com/blog/skills-explained) - Official comparison guide
9. [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) - Anthropic engineering deep dive
10. [Anthropic Launches Skills Open Standard for Claude](https://aibusiness.com/foundation-models/anthropic-launches-skills-open-standard-claude) - Open standard announcement
11. [Claude Skills are awesome, maybe a bigger deal than MCP](https://simonwillison.net/2025/Oct/16/claude-skills/) - Simon Willison analysis
12. [GitHub - ahmedasmar/devops-claude-skills](https://github.com/ahmedasmar/devops-claude-skills) - DevOps-specific Skills marketplace
13. [Claude Agent Skills: A First Principles Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/) - Technical deep dive
14. [Inside Claude Code Skills: Structure, prompts, invocation | Mikhail Shilkov](https://mikhail.io/2025/10/claude-code-skills/) - Architecture analysis
15. [Claude Skills Pricing & Availability (2025)](https://skywork.ai/blog/ai-agent/claude-skills-plan-comparison-2025/) - Plan comparison
16. [Advancing Claude for Financial Services](https://www.anthropic.com/news/advancing-claude-for-financial-services) - Finance use cases
17. [How We Use Claude Code Skills to Run 1,000+ ML Experiments a Day](https://huggingface.co/blog/sionic-ai/claude-code-skills-training) - ML workflow example
18. [How I Created a Claude Skill for Full-Stack AI Applications | Medium](https://medium.com/data-science-collective/how-i-created-a-claudes-skill-that-creates-full-stack-ai-applications-4364f1a12c56) - Practical tutorial
19. [Claude Code Skills for DevOps | Medium](https://medium.com/@ozer_akin/claude-code-skills-for-devops-5b296defd97d) - DevOps-specific guide
20. [Project Vend: Can Claude run a small shop?](https://www.anthropic.com/research/project-vend-1) - E-commerce experiment

## Appendix

### Quick Reference: SKILL.md Template

```markdown
---
name: skill-name-here
description: Clear description of what this skill does and when to use it. Include key terms users might say.
---

# Skill Name

## Overview
2-3 sentence summary of the skill's purpose.

## Instructions
1. Step one
2. Step two
3. Step three

## Examples

### Example 1: [Use Case]
**Input:** "User request here"
**Output:** Expected response format

## Guidelines
- Do this
- Avoid that
- Remember this

## References (if needed)
- **Details**: See [reference.md](reference.md)
- **Advanced**: See [advanced.md](advanced.md)
```

### Skill Discovery Checklist

Before deploying a Skill, verify:
- [ ] Description includes key trigger terms
- [ ] SKILL.md body under 500 lines
- [ ] Name is lowercase with hyphens only
- [ ] No reserved words (anthropic, claude)
- [ ] Description in third person
- [ ] Examples are concrete with input/output
- [ ] File references are one level deep
- [ ] Tested with target Claude model(s)
