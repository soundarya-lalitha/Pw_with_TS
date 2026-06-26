# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - link "Skip to main content" [ref=e3] [cursor=pointer]:
      - /url: "#main-content"
    - generic [ref=e5]:
      - link "UltimateQA" [ref=e7] [cursor=pointer]:
        - /url: /collections
        - heading "UltimateQA" [level=1] [ref=e8]
      - navigation [ref=e9]:
        - list [ref=e10]:
          - listitem [ref=e11]:
            - link "Sign In" [ref=e12] [cursor=pointer]:
              - /url: /users/sign_in
  - main [ref=e13]:
    - article [ref=e17]:
      - generic [ref=e18]:
        - heading "Ultimate QA" [level=2] [ref=e19]
        - paragraph [ref=e20]: Worldclass Automation Training
    - generic [ref=e22]:
      - heading "All Courses" [level=2] [ref=e24]
      - article
```