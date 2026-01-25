# Claude Code Agents for AI for Bharat Hackathon

This directory contains specialized Claude agents for the AI for Healthcare & Life Sciences hackathon project.

---

## 🔐 Trusted Research Sources

**90+ credible domains pre-approved** for WebFetch access. See **`.claude/TRUSTED_SOURCES.md`** for complete list.

**Categories:**
- 🏥 **Medical & Clinical**: WHO, CDC, NIH, ICMR, ADA, AHA, Mayo Clinic, AIIMS
- 📚 **Journals**: PubMed, NEJM, Lancet, JAMA, Nature Medicine, BMJ
- 🤖 **AI/ML**: arXiv, Papers with Code, IEEE, GitHub, Hugging Face
- 📊 **Datasets**: Kaggle, PhysioNet, MIMIC, Grand Challenge
- 🏛️ **Regulatory**: FDA, CDSCO, ABDM, e-Sanjeevani
- 📰 **Industry**: CB Insights, Crunchbase, MobiHealthNews

All sources are automatically accessible via WebFetch without additional permissions.

---

## Available Agents

### 1. Researcher (`researcher.md`)

**Purpose**: Perform deep research on healthcare challenges, AI/ML solutions, and implementation feasibility for India.

**Use When**:
- Starting research on a new healthcare problem area
- Evaluating AI/ML approaches for medical applications
- Assessing mobile app feasibility for healthcare solutions
- Understanding regulatory requirements (FDA, CDSCO, ABDM)
- Analyzing competitive landscape
- Gathering clinical evidence and statistics

**Input**:
- Healthcare problem or challenge area
- Specific technology or AI approach to research
- Target user population
- Geographic focus (India-specific vs. global)

**Output**: Comprehensive research report (markdown) saved to `/research/` directory with:
- Clinical context and healthcare burden (especially India)
- AI/ML technical analysis (models, datasets, benchmarks)
- Mobile implementation feasibility
- Regulatory compliance requirements
- Competitive landscape
- Implementation roadmap
- Budget estimates
- Citations and resources

**Example Invocations**:
```
@researcher

Research diabetic retinopathy detection using smartphone fundus cameras for deployment in Indian PHCs. Focus on:
- AI model accuracy benchmarks
- Hardware requirements and costs
- Integration with government digital health programs
- Clinical validation requirements
```

```
@researcher

Research mental health chatbot solutions for India. Include:
- NLP models for Hindi and regional languages
- Evidence for effectiveness of AI therapy
- Privacy and compliance requirements
- User adoption challenges in Indian context
```

```
@researcher

Research tuberculosis detection using cough sound analysis and chest X-ray AI. Focus on:
- State-of-the-art AI models and their performance
- Mobile deployment feasibility
- Integration with NIKSHAY (national TB program)
- Cost-effectiveness compared to traditional methods
```

---

## How to Use Agents

### In Claude Code CLI

Simply mention the agent name with your request:

```bash
@researcher [your research request]
```

The agent will:
1. Check for duplicate content in existing research
2. Conduct multi-source research (medical, technical, regulatory)
3. Synthesize findings into a comprehensive report
4. Save the report to `/research/` directory
5. Provide actionable recommendations

---

## Agent Capabilities

### Healthcare Domains Covered
- **Non-Communicable Diseases**: Diabetes, cardiovascular disease, cancer, respiratory
- **Communicable Diseases**: TB, malaria, dengue, HIV/AIDS
- **Maternal & Child Health**: Pregnancy, vaccination, malnutrition
- **Mental Health**: Depression, anxiety, suicide prevention
- **Rural Healthcare**: Primary care access, telemedicine
- **Public Health**: Disease surveillance, outbreak prediction
- **Healthcare Operations**: Clinical workflows, resource allocation

### AI/ML Technologies Analyzed
- **Computer Vision**: Medical imaging, diagnostic classification
- **NLP**: Clinical notes, symptom analysis, chatbots
- **Predictive Analytics**: Risk prediction, patient outcomes
- **Time-Series**: Vital signs, glucose monitoring
- **Edge AI**: On-device inference for mobile apps
- **Federated Learning**: Privacy-preserving models

### Research Sources
- **Medical**: PubMed, NEJM, Lancet, JAMA, Nature Medicine
- **AI/ML**: arXiv, Papers with Code, IEEE, ACM
- **Guidelines**: WHO, CDC, ADA, ICMR, MoHFW
- **Regulatory**: FDA, CDSCO, ABDM
- **Industry**: CB Insights, Crunchbase, startup databases
- **Datasets**: Kaggle, PhysioNet, MIMIC, Grand Challenge

---

## Output Structure

Research reports follow a standardized structure:

```markdown
# [Topic] Research Report

## Executive Summary
Brief overview of findings and feasibility

## Hackathon Submission Support
- Problem statement alignment
- Solution viability assessment (7 criteria rated)
- Key differentiators
- Estimated impact (lives, costs, access)

## Clinical Context
- Medical background
- Current standard of care
- Clinical gaps and challenges
- Expert opinions

## AI/ML Technical Analysis
- Relevant AI approaches
- State-of-the-art models with performance metrics
- Benchmark datasets
- Deployment considerations (edge vs. cloud)

## Mobile Implementation Feasibility
- Hardware requirements
- App architecture
- Offline-first design
- User experience for low digital literacy

## India-Specific Context
- Healthcare burden (GDP impact, epidemiology)
- Infrastructure gaps (facilities, workforce)
- Government programs integration
- Regulatory compliance

## Competitive Landscape
- Existing solutions (global and India)
- Case studies
- Research projects

## Implementation Roadmap
- Phase 1: MVP (Months 1-3)
- Phase 2: Pilot (Months 4-6)
- Phase 3: Scale (Months 7-12)
- Budget estimate

## Citations & Resources
- Clinical guidelines
- Peer-reviewed papers with DOI
- AI/ML technical papers
- Datasets and benchmarks
- Regulatory resources
```

---

## Quality Standards

All research reports meet these standards:

### Citation Requirements
✅ Every claim has 2+ authoritative sources
✅ Peer-reviewed papers include DOI/arXiv links
✅ Statistics sourced from official data (ICMR, WHO, Census)
✅ AI model performance metrics clearly stated

### Freshness Requirements
✅ Sources <2 years old for AI/ML topics
✅ Sources <3 years old for clinical topics
✅ Government program information verified as current
✅ Regulatory guidance from latest official documents

### India-Specific Requirements
✅ GDP burden quantified with sources
✅ Healthcare workforce shortages documented
✅ Government digital health integration mapped
✅ Regulatory path (CDSCO, ABDM) clearly outlined

### Feasibility Requirements
✅ Mobile app viability assessed (offline, app size, hardware)
✅ Technical stack recommendations
✅ Budget estimates grounded in market data
✅ Timeline realistic based on comparable projects

---

## Tips for Success

### 1. Be Specific in Research Requests
**Vague**: "Research diabetes apps"
**Specific**: "Research smartphone-based diabetic retinopathy screening using fundus camera attachments. Focus on AI model accuracy (target >90% sensitivity), hardware costs in India (₹5,000-15,000 range), and integration with National Programme for Control of Blindness."

### 2. Define Your Target Users
- Primary: [Patients, doctors, ASHA workers, etc.]
- Geographic: [Urban, rural, specific states]
- Digital literacy level: [High, medium, low]
- Language preference: [Hindi, regional languages]

### 3. Specify Constraints
- Budget: [Development budget, per-user cost]
- Timeline: [MVP in 3 months, pilot in 6 months, etc.]
- Infrastructure: [Works on 2G, offline-first, <50 MB app]
- Regulatory: [SaMD classification, CDSCO approval needed?]

### 4. Ask for Comparisons
"Compare AI-based cervical cancer screening vs. traditional Pap smear in terms of accuracy, cost, accessibility for rural India."

### 5. Focus on Differentiation
"What makes our TB detection solution different from existing apps like 99DOTS or qXR?"

---

## After Research: Next Steps

Once the researcher agent completes a report, typical next steps:

1. **Review Findings**: Read the comprehensive report
2. **Validate Feasibility**: Confirm technical and clinical viability
3. **Refine Scope**: Based on findings, narrow or expand focus
4. **Start Implementation**: Use the roadmap as a guide
5. **Regulatory Planning**: Follow the compliance checklist
6. **Hackathon Submission**: Use the "Hackathon Submission Support" section

---

## Future Agents (To Be Added)

Based on the health repository pattern, future agents could include:

- **design-creator**: Technical architecture design for healthcare AI solutions
- **implementor**: Code implementation following best practices
- **code-reviewer**: Review against clinical safety and regulatory standards
- **pitch-creator**: Generate hackathon pitch decks and presentations

---

## Questions or Issues?

If you encounter issues with the researcher agent:
1. Check the agent prompt in `researcher.md`
2. Ensure your research request is specific enough
3. Verify internet connectivity (for WebSearch/WebFetch)
4. Check `/research/` directory permissions

---

**Last Updated**: 2026-01-25
**Version**: 1.0
**Project**: AI for Healthcare & Life Sciences (AWS AI for Bharat Hackathon)
