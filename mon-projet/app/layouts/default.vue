<template>
  <header>Mon site - 
    <nav>
      <nuxt-link to="/">Accueil</nuxt-link>
      <nuxt-link to="/about">À propos</nuxt-link>
      <nuxt-link to="/formulaire">Formulaire</nuxt-link>
    </nav>
  </header>
  <main><slot /></main>
  <footer>© 2026</footer>
</template>