# Agentic AI–Powered Personal Loan Sales Assistant

**BFSI Hackathon – Tata Capital | Challenge II**

---

## Executive Summary

This project presents an **Agentic AI–driven conversational sales assistant** designed for a large-scale **Non-Banking Financial Company (NBFC)** to increase personal loan conversion rates. The solution uses a **web-based chatbot** that simulates a **human sales executive**, guiding customers from initial engagement through eligibility evaluation and automated sanction letter generation within a single conversation.

A central **Master Agent** orchestrates multiple specialized **Worker AI Agents**, enabling seamless coordination of sales, verification, underwriting, and document generation processes.

---

## Business Objective

Digital loan journeys often suffer from high drop-offs due to manual checks, delayed responses, and fragmented workflows.
The objective of this solution is to:

* Improve conversion rates from digital channels
* Automate loan processing while retaining a personalized experience
* Reduce turnaround time from lead to sanction

---

## Solution Overview

The system follows an **Agentic AI architecture**:

* **Master Agent**: Controls the conversation, understands customer intent, triggers worker agents, and manages workflow completion.
* **Sales Agent**: Collects loan requirements and engages customers in a persuasive, human-like manner.
* **Verification Agent**: Validates customer KYC data using a dummy CRM system.
* **Underwriting Agent**: Evaluates credit eligibility using a mock credit bureau API and predefined approval rules.
* **Sanction Letter Generator**: Produces an automated PDF sanction letter upon approval.

---

## End-to-End Flow

1. Customer initiates chat via digital ads or marketing campaigns
2. Loan requirements are captured through conversational interaction
3. KYC details are verified from a CRM system
4. Credit eligibility is evaluated based on score, pre-approved limits, and income
5. Loan is approved or rejected in real time
6. Sanction letter is generated and delivered within the chat

---

## Underwriting Logic

* Instant approval if loan amount is within pre-approved limit
* Salary slip required if loan amount is up to two times the pre-approved limit
* EMI must not exceed 50 percent of monthly salary
* Rejection if credit score is below 700 or loan exceeds eligibility thresholds

---

## Key Value Proposition

* Human-like conversational loan sales
* Real-time decision-making through agent orchestration
* Reduced manual intervention and faster approvals
* Scalable architecture for high-volume digital traffic

---

## Deliverables

* Web-based Agentic AI chatbot
* Automated underwriting and approval logic
* PDF-based sanction letter generation
* Five-slide presentation showcasing the complete journey

---

## Conclusion

This project demonstrates how **Agentic AI can modernize BFSI loan sales** by combining conversational intelligence with automated backend decisioning. The solution delivers higher conversion rates, faster loan sanctions, and a superior customer experience aligned with enterprise BFSI standards.
