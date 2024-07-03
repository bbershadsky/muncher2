# Munch Recipes 2.0

Purpose: Use Appwrite for Munch as a backend service.

Limitations: Videos over 8 minutes overflow `openhermes` context and prompt instructions break during output

<!-- ## TODO -->

<!-- - Finalize IRecipe -->
<!-- - Provisioning script for Appwrite Recipes model -->

<!-- - Load Data with this nice card layout https://demos.themeselection.com/materio-mui-nextjs-admin-template-free/demo/card-basic -->
  <!-- - Recipe "details" page -->
  <!-- - Search / filtering functionality (culture) -->
  <!-- - Submit your URL to queue -->
  <!-- - Appwrite processing on server -->
  <!-- Clicking on the queue item should run the ETL script and update appwrite -->
<!-- dark mode -->

## Installation

```bash
pnpm i
pnpm start
```

### Connect Appwrite

Add credentials to Appwrite cloud or self hosted
https://appwrite.io/docs/advanced/self-hosting/functions

### Server Install

```bash
wget https://ollama.ai/install.sh
sh ./install.sh
ollama run openhermes
# `ollama run qwen2:0.5b` on lower RAM systems
systemctl edit ollama.service

# Add this to allow remote connections
[Service]
Environment="OLLAMA_HOST=0.0.0.0"

systemctl restart ollama.service

npm install -g node-appwrite

# npm install -g appwrite-cli
```

## Serverless Function

npm install -g appwrite-cli

## Updating

```bash
pnpm upgrade
```

<div align="center" style="margin: 30px;">
    <a href="https://refine.dev">
    <img alt="refine logo" src="https://refine.ams3.cdn.digitaloceanspaces.com/readme/refine-readme-banner.png">
    </a>
</div>
<br/>
<div align="center"><strong>refine</strong> is a <a href="https://reactjs.org/">React</a>-based framework for building internal tools, rapidly. ✨  It's is a a collection of helper hooks, components and providers. They are all decoupled from your UI components and business logic, so they never keep you from customizing your UI or coding your own flow.
<br/>

<div align="center">
  <sub>Created by <a href="https://refine.dev">refine</a></sub>
</div>

## About

[refine](https://refine.dev/) is **headless by design**, offering unlimited styling and customization options. Moreover, refine ships with ready-made integrations for [Ant Design](https://ant.design/), [Material UI](https://mui.com/material-ui/getting-started/overview/), [Mantine](https://mantine.dev/), and [Chakra UI](https://chakra-ui.com/) for convenience.

refine has connectors for 15+ backend services, including REST API, [GraphQL](https://graphql.org/), and popular services like [Airtable](https://www.airtable.com/), [Strapi](https://strapi.io/), [Supabase](https://supabase.com/), [Firebase](https://firebase.google.com/), and [Directus](https://directus.io/)

[Refer to documentation for more info about refine&#8594](https://refine.dev/docs/)
[Step up to refine tutorials &#8594](https://refine.dev/docs/tutorial/introduction/index/)
