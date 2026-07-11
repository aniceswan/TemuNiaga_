# Load Testing

Not scripted this pass — meaningful load testing needs a deployed environment, not a single-machine dev stack. Intent for when one exists:

```bash
# k6 script sketch (not yet written):
# ramp to N virtual users hitting GET /koperasi and GET /koperasi/:ref/anggota
# on apps/api, measure p95 latency and error rate against plan.md §32's
# "response time" / "cost per interaction" KPIs.
k6 run load/koperasi-read.js
```
