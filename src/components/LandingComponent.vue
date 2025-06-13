<template>
  <div class="content-box landing-container">
    <div class="header-section">
      <h1>Pathfinder Honor Manager <span class="beta-badge">BETA</span></h1>
      <button
        class="secondary button login-button"
        @click="login"
      >
        <span class="login-text">Existing User?</span>&nbsp;<strong>Log In</strong>
      </button>
    </div>
    
    <p class="intro-text">
      Streamline your Pathfinder club's honor tracking and management with our digital platform. 
      Say goodbye to paper records and hello to efficient, organized honor management.
    </p>

    <div class="honortable">
      <div class="feature-card">
        <h3 class="above-accent">
          Track Progress
        </h3>
        <p>Monitor each Pathfinder's honor journey from planning to completion with our intuitive dashboard.</p>
      </div>
      
      <div class="feature-card">
        <h3 class="above-accent">
          Bulk Management
        </h3>
        <p>Easily assign and update honors for multiple Pathfinders at once, perfect for group activities.</p>
      </div>
      
      <div class="feature-card">
        <h3 class="above-accent">
          Digital Records
        </h3>
        <p>Keep all honor records in one secure place, accessible to authorized club staff whenever needed.</p>
      </div>
    </div>

    <div class="center-align cta-section">
      <button
        class="primary button"
        @click="login"
      >
        Try It Free - Create Test Account
      </button>
      <p class="note">
        You need a Google account to sign up. Create a test account to explore the platform 
        and see if it's right for your club.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  setup() {
    const { loginWithRedirect } = useAuth0();

    return {
      login: () => {
        loginWithRedirect({
          appState: { targetUrl: "/club" }
        });
      },
    };
  },
});
</script>

<style scoped>
.landing-container {
  padding: 0;
  max-width: 1400px;
  margin: 0 auto;
}

/* Landing page layout overrides */
:global(#grid.landing-layout) {
  grid-template-columns: 1fr;
  grid-template-areas: "content";
}

:global(.landing-content) {
  padding: 1rem;
  max-width: none;
  margin: 0 auto;
}

@media screen and (max-width: 1080px) {
  :global(.landing-content) {
    height: 100vh;
  }
}

.intro-text {
  font-size: 1.2em;
  line-height: 1.5;
  margin: 1.5rem 0 2rem;
  max-width: none;
}

.login-button {
  font-size: 1em;
  padding: 0.5em 1em;
  white-space: nowrap;
  border: none !important;
}

.login-button:hover {
  filter: brightness(1.2) !important;
}

.login-text {
  opacity: 0.9;
}

.honortable {
  margin: 1rem 0;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.feature-card {
  position: relative;
  margin: 0;
  padding: 1.25rem;
  text-align: left;
  background-color: var(--grey);
  border-radius: 8px;
}

.feature-card h3 {
  margin-top: 0;
  font-size: 1.4em;
}

.feature-card p {
  font-size: 1.1em;
  line-height: 1.4;
  margin: 0.5rem 0 0;
}

.cta-section {
  margin-top: 1rem;
  padding: 1.5rem;
  text-align: center;
  background-color: var(--grey);
  border-radius: 8px;
}

.cta-section button {
  font-size: 1.4em;
  padding: 0.75em 1.5em;
  margin-bottom: 0.75rem;
}

.cta-section .note {
  font-size: 1em;
  max-width: none;
  margin: 0 auto;
}

@media (max-width: 800px) {
  .login-button {
    width: 100%;
  }

  .intro-text {
    font-size: 1.1em;
    margin: 1.5rem 0 2rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .cta-section {
    padding: 2rem 1.5rem;
  }

  .cta-section button {
    width: 100%;
    font-size: 1.2em;
  }
}
</style> 