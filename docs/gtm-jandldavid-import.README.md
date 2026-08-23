# GTM Import

Import file: `docs/gtm-jandldavid-import.json`

Import mode recommendation:
- Workspace: create a fresh workspace in GTM
- Import option: `Merge`
- Conflict resolution: `Overwrite` only if GTM asks and you are importing into an empty or dedicated analytics workspace

What is included:
- 1 GA4 Configuration tag for `G-GK6J066JQN`
- 1 generic GA4 Event tag that listens to the supported custom events pushed by the site
- Built-in variables for page, click, form and history source context
- Data Layer variables for the main analytics parameters used by the project

Supported events in the generic trigger:
- `page_view`
- `cta_clicked`
- `form_started`
- `form_submitted`
- `form_submission_failed`
- `project_page_entered`
- `project_completed`
- `outbound_link_clicked`
- `email_link_clicked`
- `phone_link_clicked`
- `ai_message_sent`
- `ai_cta_clicked`
- `engagement_score`

Notes:
- Consent defaults are already handled in the Laravel head, so this import intentionally does not create an extra Consent Defaults tag.
- GTM does not expose true built-in variables named `History New URL` and `History Old URL` for web containers, so they are not included as built-ins in this import.
- After import, use GTM Preview and GA4 Realtime before publishing.
- In GA4, mark `form_submitted` as a conversion. Optionally mark `cta_clicked` and `ai_cta_clicked` too.
